import { BoxRenderable, TextRenderable, createCliRenderer } from "@opentui/core"

const renderer = await createCliRenderer({ exitOnCtrlC: true })
renderer.start()

const card = new BoxRenderable(renderer, {
  id: "osc11-repro-card",
  width: "100%",
  height: "100%",
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "column",
  backgroundColor: "#ff0000",
})

const status = new TextRenderable(renderer, {
  content: "Renderer background: #ff0000",
})

card.add(
  new TextRenderable(renderer, {
    content: [
      "OpenTUI PR #1548 — terminal background sync",
      "",
      "Renderer background cycles through RGB",
      "",
      "Maximize or snap this Windows Terminal window.",
      "The right/bottom pixel gutter should follow the color cycle.",
      "Press Ctrl+C to exit; the terminal's original background is restored.",
    ].join("\n"),
  }),
)
card.add(status)

renderer.root.add(card)

let frame = 0
const colorCycle = setInterval(() => {
  const phase = (frame / 240) * Math.PI * 2
  const channel = (offset: number): number => Math.round(127.5 + 127.5 * Math.sin(phase + offset))
  const hex = (value: number): string => value.toString(16).padStart(2, "0")
  const background = `#${hex(channel(0))}${hex(channel((2 * Math.PI) / 3))}${hex(channel((4 * Math.PI) / 3))}`

  card.backgroundColor = background
  status.content = `Renderer background: ${background}`
  renderer.setBackgroundColor(background)
  frame = (frame + 1) % 240
}, 33)

renderer.on("destroy", () => clearInterval(colorCycle))

if (process.argv.includes("--smoke")) {
  setTimeout(() => renderer.destroy(), 1_500)
}
