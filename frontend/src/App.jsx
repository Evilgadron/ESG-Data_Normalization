import { useEffect, useMemo, useState } from 'react';

function App() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    async function fetchRows() {
      try {
      const response = await fetch('https://esg-data-normalization.vercel.app/api/rows/');      
      const data = await response.json();
        setRows(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchRows();
  }, []);

  const handleApprove = async (id) => {
    try {
    const response = await fetch(`https://esg-data-normalization.vercel.app/api/rows/${id}/approve/`, {        
      method: 'POST',
      });

      if (response.ok) {
        setRows((prev) =>
          prev.map((row) =>
            row.id === id ? { ...row, status: 'APPROVED' } : row
          )
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const stats = useMemo(() => {
    return {
      total: rows.length,
      approved: rows.filter((r) => r.status === 'APPROVED').length,
      flagged: rows.filter((r) => r.status === 'FLAGGED').length,
      pending: rows.filter((r) => r.status !== 'APPROVED' && r.status !== 'FLAGGED').length,
    };
  }, [rows]);

  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      const matchesSearch =
        query === '' ||
        JSON.stringify(row.raw_data).toLowerCase().includes(query.toLowerCase());
        String(row.id).toLowerCase().includes(query.toLowerCase());

      const matchesStatus =
        statusFilter === 'ALL' || row.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [rows, query, statusFilter]);

  const statusBadge = (status) => {
    if (status === 'APPROVED') {
      return <span className="inline-flex items-center rounded-sm bg-green-100 px-2 py-0.5 text-[11px] font-bold text-green-800 uppercase tracking-wide">Approved</span>;
    }
    if (status === 'FLAGGED') {
      return <span className="inline-flex items-center rounded-sm bg-red-100 px-2 py-0.5 text-[11px] font-bold text-red-800 uppercase tracking-wide">Action Req</span>;
    }
    return <span className="inline-flex items-center rounded-sm bg-gray-200 px-2 py-0.5 text-[11px] font-bold text-gray-800 uppercase tracking-wide">Pending</span>;
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 text-sm">
      
      {/* Top Navigation Bar (MNC Style) */}
      <div className="bg-[#1a73e8] px-4 py-2 flex items-center justify-between text-white shadow-md">
        <div className="flex items-center gap-4">
          <div className="font-medium text-base tracking-wide">ESG Data Integration Center</div>
          <div className="border-l border-blue-400 h-5"></div>
          <div className="text-sm text-blue-100">Activity Normalization Pipeline</div>
        </div>
        <div className="text-xs bg-blue-800 px-2 py-1 rounded">
          us-central1 (Production)
        </div>
      </div>

      <div className="p-6 max-w-[1400px] mx-auto">
        
        {/* Page Header & Breadcrumbs */}
        <div className="mb-4">
          <h1 className="text-xl font-normal text-gray-800">Review Data Rows</h1>
          <p className="text-xs text-gray-500 mt-1">Review ingested multi-tenant data before writing to the immutable audit ledger.</p>
        </div>

        {/* Unified Summary Strip (AWS/GCP Style) */}
        <div className="mb-6 flex border border-gray-300 rounded-sm bg-gray-50 shadow-sm overflow-hidden">
          <div className="flex-1 p-4 border-r border-gray-300">
            <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Total Ingested</div>
            <div className="mt-1 text-2xl font-light text-gray-900">{stats.total}</div>
          </div>
          <div className="flex-1 p-4 border-r border-gray-300">
            <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Pending Analyst Review</div>
            <div className="mt-1 text-2xl font-light text-gray-900">{stats.pending}</div>
          </div>
          <div className="flex-1 p-4 border-r border-gray-300 bg-red-50/30">
            <div className="text-[11px] font-semibold text-red-600 uppercase tracking-wider">Anomalies Detected</div>
            <div className={`mt-1 text-2xl font-light ${stats.flagged > 0 ? 'text-red-700' : 'text-gray-900'}`}>{stats.flagged}</div>
          </div>
          <div className="flex-1 p-4">
            <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Cleared / Approved</div>
            <div className="mt-1 text-2xl font-light text-gray-900">{stats.approved}</div>
          </div>
        </div>

        {/* Data Table Section */}
        <div className="border border-gray-300 rounded-sm shadow-sm bg-white">
          
          {/* Controls Bar */}
          <div className="border-b border-gray-300 bg-white px-4 py-3 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 w-full max-w-md">
              <span className="text-gray-500 text-xs font-medium">Filter</span>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search raw payloads or UUIDs..."
                className="w-full text-sm border border-gray-300 rounded-sm px-3 py-1.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              />
            </div>
            
            <div className="flex bg-white border border-gray-300 rounded-sm overflow-hidden">
              {['ALL', 'PENDING', 'FLAGGED', 'APPROVED'].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`
                    px-3 py-1.5 text-xs font-medium border-r border-gray-300 last:border-r-0
                    ${statusFilter === status ? 'bg-blue-50 text-blue-700 font-bold' : 'text-gray-600 hover:bg-gray-50'}
                  `}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Actual Table with Explicit Row & Column Borders */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100 border-b border-gray-300">
                  <th className="p-3 text-xs font-semibold text-gray-700 border-r border-gray-300 w-32">Scope / Record ID</th>
                  <th className="p-3 text-xs font-semibold text-gray-700 border-r border-gray-300">Raw Source Payload</th>
                  <th className="p-3 text-xs font-semibold text-gray-700 border-r border-gray-300 w-32">Normalized</th>
                  <th className="p-3 text-xs font-semibold text-gray-700 border-r border-gray-300 w-32">kg CO₂e</th>
                  <th className="p-3 text-xs font-semibold text-gray-700 border-r border-gray-300 w-28">State</th>
                  <th className="p-3 text-xs font-semibold text-gray-700 w-24 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-gray-500">Querying data warehouse...</td>
                  </tr>
                ) : filteredRows.length > 0 ? (
                  filteredRows.map((row) => (
                    <tr key={row.id} className="border-b border-gray-200 hover:bg-[#f4f8fe] transition-colors">
                      
                      <td className="p-3 border-r border-gray-200 align-top">
                        <div className="font-semibold text-gray-900">Scope {row.scope}</div>
                        <div className="text-[10px] text-gray-500 font-mono mt-1">
                          {row.id ? String(row.id).substring(0, 8) : 'N/A'}
                        </div>
                      </td>
                      
                      <td className="p-3 border-r border-gray-200 align-top">
                        <div className="flex flex-wrap gap-1">
                          {Object.entries(row.raw_data || {}).map(([key, val]) => (
                            <div key={key} className="flex bg-gray-50 border border-gray-200 rounded-sm text-[11px] font-mono overflow-hidden">
                              <span className="bg-gray-100 text-gray-600 px-1.5 py-0.5 border-r border-gray-200">{key}</span>
                              <span className="px-1.5 py-0.5 text-gray-900">{String(val)}</span>
                            </div>
                          ))}
                        </div>
                      </td>

                      <td className="p-3 border-r border-gray-200 align-top">
                        <div className="text-sm text-gray-900">{row.normalized_value?.toLocaleString()}</div>
                        <div className="text-[11px] text-gray-500">{row.normalized_unit}</div>
                      </td>

                      <td className="p-3 border-r border-gray-200 align-top">
                        <div className="text-sm font-medium text-gray-900">
                          {row.emissions_kg_co2e?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                      </td>

                      <td className="p-3 border-r border-gray-200 align-top">
                        {statusBadge(row.status)}
                      </td>

                      <td className="p-3 align-top text-center">
                        {row.status !== 'APPROVED' ? (
                          <button
                            onClick={() => handleApprove(row.id)}
                            className="text-xs bg-white border border-gray-300 text-blue-600 hover:bg-blue-50 font-medium py-1 px-3 rounded-sm shadow-sm w-full"
                          >
                            APPROVE
                          </button>
                        ) : (
                          <span className="text-[10px] text-gray-400 font-medium uppercase">Locked</span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-gray-500">
                      No records matching the current filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {/* Pagination Footer Mockup */}
          <div className="bg-gray-50 border-t border-gray-300 px-4 py-2 text-xs text-gray-500 flex justify-between items-center">
            <span>Showing {filteredRows.length} of {stats.total} rows</span>
            <div className="flex gap-2">
              <button className="px-2 py-1 border border-gray-300 rounded-sm bg-white disabled:opacity-50" disabled>Previous</button>
              <button className="px-2 py-1 border border-gray-300 rounded-sm bg-white disabled:opacity-50" disabled>Next</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
