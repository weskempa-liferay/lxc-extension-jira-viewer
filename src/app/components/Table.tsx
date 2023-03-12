type TableProps = {
  className?: string;
  columns: {
    key: string;
    render?: (value: any, item: any) => any;
    value: string;
    width?: number;
  }[];
  rows: any[];
};

export default function Table({ className, columns, rows }: TableProps) {
  return (
    <table className={`${className} table`}>
      <thead>
        <tr>
          {columns.map((column, index) => (
            <th key={index}>{column.value}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, index) => (
          <tr key={index}>
            {columns.map((column, columnIndex) => (
              <td key={columnIndex} width={column.width}>
                {column.render
                  ? column.render(row[column.key], row)
                  : row[column.key]}{' '}
                {}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
