export default function DataTable({ columns, data, emptyText = 'Kayıt bulunamadı.' }) {
  return (
    <div className="-mx-5 -mb-5 overflow-x-auto max-[640px]:-mx-4 max-[640px]:-mb-4">
      <table className="w-full min-w-[760px] border-collapse">
        <thead>
          <tr>{columns.map((column) => <th className="whitespace-nowrap border-y border-gray-200 bg-gray-50 px-4 py-[11px] text-left text-[10px] font-bold uppercase tracking-[.35px] text-gray-500" key={column.key}>{column.label}</th>)}</tr>
        </thead>
        <tbody>
          {data.length === 0 && <tr><td colSpan={columns.length} className="whitespace-nowrap border-b border-[#f1f3f5] px-4 py-[13px] text-center text-[11px] text-gray-500">{emptyText}</td></tr>}
          {data.map((row, index) => (
            <tr className="hover:bg-[#fffaf5] [&:last-child_td]:border-b-0" key={row.id || `${index}-${Object.values(row)[0]}`}>
              {columns.map((column) => <td className="whitespace-nowrap border-b border-[#f1f3f5] px-4 py-[13px] text-[11px] text-gray-700" key={column.key}>{column.render ? column.render(row, index) : row[column.key]}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
