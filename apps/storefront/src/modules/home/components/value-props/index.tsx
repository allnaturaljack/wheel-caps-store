const PROPS = [
  {
    title: "Printed to order",
    body: "Each cap is printed when you order it, in the fitment and color you picked.",
  },
  {
    title: "Made for 8-lug trucks",
    body: "Sized by bolt pattern for Ford Super Duty, Ram HD and GM HD wheels.",
  },
  {
    title: "Singles or full sets",
    body: "Replace the one cap you lost, or outfit all four wheels with a 4-pack.",
  },
]

const ValueProps = () => {
  return (
    <section className="border-y border-grey-20 bg-grey-5">
      <ul className="content-container grid gap-10 py-14 small:grid-cols-3">
        {PROPS.map((prop, index) => (
          <li key={prop.title} className="flex gap-x-5">
            <span className="font-display text-5xl font-bold leading-none text-brand">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div>
              <h3 className="display-heading text-2xl text-ink-900">
                {prop.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-grey-60">{prop.body}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default ValueProps
