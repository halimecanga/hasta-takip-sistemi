export default function PageTitle({ title, subtitle, action }) {
  return (
    <div className="mb-6 flex items-center justify-between gap-[18px] max-[640px]:mb-[18px] max-[640px]:items-start">
      <div>
        <h1 className="m-0 text-[25px] tracking-[-.6px] max-[640px]:text-[21px]">{title}</h1>
        {subtitle && <p className="mt-1.5 text-xs text-gray-500 max-[640px]:text-[11px]">{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}
