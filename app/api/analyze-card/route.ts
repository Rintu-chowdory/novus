import { Output, generateText } from 'ai'
import { z } from 'zod'

const reactionSchema = z.object({
  cardRecognized: z.boolean(),
  qualityFlags: z.array(z.string()).max(8),
  antiA: z.object({ call: z.enum(['positive', 'negative', 'uncertain']), confidence: z.number().min(0).max(1), evidence: z.string().max(240) }),
  antiB: z.object({ call: z.enum(['positive', 'negative', 'uncertain']), confidence: z.number().min(0).max(1), evidence: z.string().max(240) }),
  antiD: z.object({ call: z.enum(['positive', 'negative', 'uncertain']), confidence: z.number().min(0).max(1), evidence: z.string().max(240) }),
  explanation: z.string().max(500),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    if (typeof body.image !== 'string' || !body.image.startsWith('data:image/')) return Response.json({ error: 'A data URL image is required.' }, { status: 400 })
    if (body.image.length > 8_000_000) return Response.json({ error: 'Image is too large.' }, { status: 413 })
    const result = await generateText({
      model: 'google/gemini-2.5-flash',
      output: Output.object({ schema: reactionSchema }),
      temperature: 0,
      system: 'You review standardized ABO/Rh test cards as a research aid. Never infer from a person, skin, or free blood. Inspect only the card. A reaction is positive only when visible agglutination/clumping is clear; smooth liquid is negative; anything unclear is uncertain. If the card layout is not unmistakable, set cardRecognized false and all calls uncertain. Do not diagnose. Return concise evidence.',
      messages: [{ role: 'user', content: [{ type: 'text', text: 'Inspect this image for the three labeled reaction zones Anti-A, Anti-B, and Anti-D. Be conservative and mark uncertain whenever glare, blur, crop, or missing labels prevents a reliable read.' }, { type: 'image', image: body.image }] }],
    })
    return Response.json(result.output)
  } catch (error) {
    console.error('[bloodscan] vision analysis failed', error)
    return Response.json({ error: 'Vision review unavailable. The local safety check remains inconclusive.' }, { status: 502 })
  }
}
