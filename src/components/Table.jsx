import React from "react";

export default function Table({ columns, data }) {
  if (!data || data.length === 0) {
    return (
      <div className="text-gray-400 text-center py-8">No data available.</div>
    );
  }

  return (
    <div className="overflow-x-auto max-h-[70vh]">
      <table className="min-w-full text-sm text-left text-gray-300">
        <thead className="bg-gray-900/80 text-xs uppercase text-gray-400 sticky top-0">
          <tr>
            {columns.map((col) => (
              <th key={col.accessor} className="px-4 py-3">
                {col.Header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-black/40 divide-y divide-gray-800">
          {data.map((row, rowIndex) => (
            <tr key={row.id || row.obs_id || rowIndex}>
              {columns.map((col) => (
                <td key={col.accessor} className="px-4 py-3">
                  {col.Cell
                    ? col.Cell(row[col.accessor], row)
                    : row[col.accessor] ?? "—"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
