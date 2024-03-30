const StatsTable = (props) => {
  let summaryStats = props.summaryStats;
  delete summaryStats['id'];

  return (
    <div className="overflow-x-auto my-4">
      <table className="min-w-full leading-normal">
        <thead className="bg-[#161B22]">
          <tr>
            <th className="px-5 py-3 border-b-2 border-[#0D1117] bg-[#161B22] text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Metric
            </th>
            <th className="px-5 py-3 border-b-2 border-[#0D1117] bg-[#161B22] text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Count
            </th>
            <th className="px-5 py-3 border-b-2 border-[#0D1117] bg-[#161B22] text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Mean
            </th>
            <th className="px-5 py-3 border-b-2 border-[#0D1117] bg-[#161B22] text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Stand. Dev.
            </th>
            <th className="px-5 py-3 border-b-2 border-[#0D1117] bg-[#161B22] text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Min
            </th>
            <th className="px-5 py-3 border-b-2 border-[#0D1117] bg-[#161B22] text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Max
            </th>
            <th className="px-5 py-3 border-b-2 border-[#0D1117] bg-[#161B22] text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              25%
            </th>
            <th className="px-5 py-3 border-b-2 border-[#0D1117] bg-[#161B22] text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              50%
            </th>
            <th className="px-5 py-3 border-b-2 border-[#0D1117] bg-[#161B22] text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              75%
            </th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(summaryStats).map(([key, value]) => (
            <tr key={key} className="border-b border-gray-200">
              <td className="px-5 py-5 bg-[#161B22] text-sm border-b-2 border-[#0D1117]">
                <p className="text-white whitespace-no-wrap ">{key}</p>
              </td>
              <td className="px-5 py-5 bg-[#161B22] text-sm border-b-2 border-[#0D1117]">
                <p className="text-white whitespace-no-wrap">{value.count}</p>
              </td>
              <td className="px-5 py-5 bg-[#161B22] text-sm border-b-2 border-[#0D1117]">
                <p className="text-white whitespace-no-wrap">
                  {value.mean.toFixed(2)}
                </p>
              </td>
              <td className="px-5 py-5 bg-[#161B22] text-sm border-b-2 border-[#0D1117]">
                <p className="text-white whitespace-no-wrap">
                  {value.std.toFixed(2)}
                </p>
              </td>
              <td className="px-5 py-5 bg-[#161B22] text-sm border-b-2 border-[#0D1117]">
                <p className="text-white whitespace-no-wrap">{value.min}</p>
              </td>
              <td className="px-5 py-5 bg-[#161B22] text-sm border-b-2 border-[#0D1117]">
                <p className="text-white whitespace-no-wrap">{value.max}</p>
              </td>
              <td className="px-5 py-5 bg-[#161B22] text-sm border-b-2 border-[#0D1117]">
                <p className="text-white whitespace-no-wrap">
                  {value['25%'].toFixed(2)}
                </p>
              </td>
              <td className="px-5 py-5 bg-[#161B22] text-sm border-b-2 border-[#0D1117]">
                <p className="text-white whitespace-no-wrap">
                  {value['50%'].toFixed(2)}
                </p>
              </td>
              <td className="px-5 py-5 bg-[#161B22] text-sm border-b-2 border-[#0D1117]">
                <p className="text-white whitespace-no-wrap">
                  {value['75%'].toFixed(2)}
                </p>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StatsTable;
