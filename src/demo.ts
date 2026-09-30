import { BoxRenderable, TextRenderable, createCliRenderer } from "@opentui/core"

const background = "#21232e"
const renderer = await createCliRenderer({ exitOnCtrlC: true })
renderer.start()
renderer.setBackgroundColor(background)

const card = new BoxRenderable(renderer, {
  id: "osc11-repro-card",
  width: "100%",
  height: "100%",
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "column",
  backgroundColor: background,
})

card.add(
  new TextRenderable(renderer, {
    content: [
      "OpenTUI PR #1548 — terminal background sync",
      "",
      `Renderer background: ${background}`,
      "",
      "Maximize or snap this Windows Terminal window.",
      "The right/bottom pixel gutter should match the app background.",
      "Press Ctrl+C to exit; the terminal's original background is restored.",
    ].join("\n"),
  }),
)

renderer.root.add(card)

if (process.argv.includes("--smoke")) {
  setTimeout(() => renderer.destroy(), 1_500)
}
