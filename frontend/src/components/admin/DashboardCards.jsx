export default function DashboardCards({
  cards,
}) {
  return (
    <div className="grid xl:grid-cols-4 md:grid-cols-2 gap-6">
      {cards.map(
        (card) => (
          <div
            key={card.title}
            className="
              bg-slate-900
              border
              border-slate-800
              rounded-3xl
              p-6
              hover:border-cyan-500
              hover:-translate-y-1
              transition-all
            "
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-slate-400 text-sm">
                  {card.title}
                </p>

                <h2 className="text-4xl font-bold mt-3">
                  {card.value}
                </h2>
              </div>

              <div
                className={`
                  h-16
                  w-16
                  rounded-2xl
                  flex
                  items-center
                  justify-center
                  bg-slate-800
                  ${card.color}
                `}
              >
                {card.icon}
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
}