/**
 * The four clipped corner brackets the Dashboard draws inside its panels.
 * `color` is a Tailwind background utility, e.g. "bg-primary-fixed-dim".
 */
export default function PanelBrackets({ color }: { color: string }) {
  return (
    <>
      <div className={`absolute inset-0 ${color} panel-bracket-tl`}></div>
      <div className={`absolute inset-0 ${color} panel-bracket-tr`}></div>
      <div className={`absolute inset-0 ${color} panel-bracket-bl`}></div>
      <div className={`absolute inset-0 ${color} panel-bracket-br`}></div>
    </>
  )
}
