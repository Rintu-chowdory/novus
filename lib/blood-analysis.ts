export type ReactionCall = 'positive' | 'negative' | 'uncertain'
export type ZoneName = 'antiA' | 'antiB' | 'antiD'

export type LocalAnalysis = {
  status: 'interpretable' | 'inconclusive'
  reason: string
  quality: { score: number; blur: number; glare: number; framing: number }
  reactions: Record<ZoneName, { call: ReactionCall; confidence: number; evidence: string }>
  bloodType: string | null
}

const zoneNames: ZoneName[] = ['antiA', 'antiB', 'antiD']

export async function analyzeImageLocally(source: string): Promise<LocalAnalysis> {
  const image = await loadImage(source)
  const canvas = document.createElement('canvas')
  const scale = Math.min(1, 1200 / Math.max(image.naturalWidth, image.naturalHeight))
  canvas.width = Math.max(1, Math.round(image.naturalWidth * scale))
  canvas.height = Math.max(1, Math.round(image.naturalHeight * scale))
  const context = canvas.getContext('2d', { willReadFrequently: true })
  if (!context) throw new Error('Image processing is unavailable in this browser.')
  context.drawImage(image, 0, 0, canvas.width, canvas.height)
  const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data
  let brightness = 0
  let contrast = 0
  let highlights = 0
  for (let i = 0; i < pixels.length; i += 16) {
    const value = (pixels[i] * 299 + pixels[i + 1] * 587 + pixels[i + 2] * 114) / 1000
    brightness += value
    contrast += Math.abs(value - 128)
    if (value > 247) highlights += 1
  }
  const samples = pixels.length / 16
  brightness /= samples
  contrast /= samples
  const glare = Math.min(1, highlights / Math.max(1, samples * 0.08))
  const blur = Math.max(0, Math.min(1, 1 - contrast / 58))
  const framing = image.naturalWidth >= 700 && image.naturalHeight >= 450 && image.naturalWidth / image.naturalHeight > 1.15 ? 0.88 : 0.35
  const qualityScore = Math.round((1 - blur * 0.45 - glare * 0.4 + framing * 0.35) * 100)
  const readable = qualityScore >= 62 && glare < 0.55 && blur < 0.62 && framing >= 0.7
  const reason = !readable ? (!framing ? 'Card framing is not recognizable.' : glare >= 0.55 ? 'Glare obscures reaction zones.' : blur >= 0.62 ? 'Image is too soft to read.' : 'Image quality is below the safe threshold.') : 'Image quality passed conservative checks; reaction evidence still requires card calibration.'
  const reactions = Object.fromEntries(zoneNames.map((zone) => [zone, { call: 'uncertain', confidence: readable ? 0.42 : 0.12, evidence: 'No calibrated zone classifier is available yet.' }])) as LocalAnalysis['reactions']
  return { status: 'inconclusive', reason, quality: { score: Math.max(0, Math.min(100, qualityScore)), blur, glare, framing }, reactions, bloodType: null }
}

function loadImage(source: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error('The image could not be decoded.'))
    image.src = source
  })
}

export function deriveBloodType(reactions: Record<ZoneName, ReactionCall>) {
  if (Object.values(reactions).some((call) => call === 'uncertain')) return null
  const abo = reactions.antiA === 'positive' && reactions.antiB === 'negative' ? 'A' : reactions.antiA === 'negative' && reactions.antiB === 'positive' ? 'B' : reactions.antiA === 'positive' && reactions.antiB === 'positive' ? 'AB' : reactions.antiA === 'negative' && reactions.antiB === 'negative' ? 'O' : null
  return abo ? `${abo}${reactions.antiD === 'positive' ? '+' : '-'}` : null
}
