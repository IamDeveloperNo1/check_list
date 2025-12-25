'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Search, Gift, Clock, CheckCircle2, XCircle, Loader2, User } from 'lucide-react';

interface Employee {
  emp_id: string;
  emp_name: string;
  checkIn: string;
  eligible: number;
}

export default function EmployeeGiftTracker() {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedTerm, setDebouncedTerm] = useState('');
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  // Debounce search term เพื่อลดภาระการ Render
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedTerm(searchTerm), 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const getData = async () => {
    setLoading(true);
    try {
      const res = await fetch('https://checklist-peach-rho.vercel.app/api/employee');
      const result = await res.json();

      const rawData = Array.isArray(result)
        ? result
        : (Array.isArray(result.data) ? result.data : []);

      const mapped: Employee[] = rawData.map((item: any) => ({
        emp_id: item.emp_id,
        emp_name: item.emp_name,
        checkIn: item.time_scan ?? '-',
        eligible: item.eligible ?? 0,
      }));

      setEmployees(mapped);
    } catch (err) {
      console.error('Fetch error:', err);
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) =>
      emp.emp_id?.toLowerCase().includes(debouncedTerm?.toLowerCase())
    );
  }, [employees, debouncedTerm]);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans selection:bg-blue-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-3 rounded-2xl shadow-lg shadow-blue-200">
                <Gift className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-800">
                  ระบบตรวจสอบสิทธิ์รับของขวัญ
                </h1>
                <p className="text-slate-500 text-sm font-medium">Haier Electric Thailand</p>
              </div>
            </div>
            <button
              onClick={getData}
              className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
            >
              รีเฟรชข้อมูล
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Search Bar */}
        <div className="mb-8 group">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors w-5 h-5" />
            <input
              type="text"
              placeholder="ค้นหาด้วยชื่อ หรือ รหัสพนักงาน..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl border border-slate-200 shadow-sm focus:ring-4 focus:ring-blue-50 focus:border-blue-400 outline-none transition-all text-lg"
            />
          </div>
        </div>

        {/* Content Section */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 text-slate-400">
              <Loader2 className="w-10 h-10 animate-spin mb-4 text-blue-500" />
              <p className="font-medium animate-pulse">กำลังดึงข้อมูลพนักงาน...</p>
            </div>
          ) : filteredEmployees.length === 0 ? (
            <div className="text-center py-24 bg-slate-50/50">
              <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                <Search className="w-8 h-8 text-slate-300" />
              </div>
              <p className="text-slate-500 font-medium text-lg">ไม่พบข้อมูลพนักงานที่คุณค้นหา</p>
              <button
                onClick={() => setSearchTerm('')}
                className="mt-2 text-blue-600 hover:underline text-sm"
              >
                ล้างการค้นหา
              </button>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-100">
                      <th className="px-8 py-5 font-semibold text-slate-600 text-sm uppercase tracking-wider">พนักงาน</th>
                      <th className="px-8 py-5 font-semibold text-slate-600 text-sm uppercase tracking-wider">เวลาสแกนเข้างาน</th>
                      <th className="px-8 py-5 font-semibold text-slate-600 text-sm uppercase tracking-wider text-right">สถานะสิทธิ์</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredEmployees.map((emp,idx) => (
                      <tr key={idx} className="hover:bg-blue-50/30 transition-colors group">
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-4">
                            <div className="w-11 h-11 bg-slate-100 rounded-full flex items-center justify-center text-blue-600 font-bold group-hover:bg-blue-100 transition-colors">
                              <User className="w-5 h-5" />
                            </div>
                            <div>
                              <div className="font-bold text-slate-800">{emp.emp_name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-2 text-slate-600 font-medium">
                            <Clock className="w-4 h-4 text-slate-400" />
                            {emp.checkIn}
                          </div>
                        </td>
                        <td className="px-8 py-5 text-right">
                          <StatusBadge eligible={emp.eligible} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile List */}
              <div className="md:hidden divide-y divide-slate-100">
                {filteredEmployees.map((emp,idx) => (
                  <div key={idx} className="p-5 active:bg-slate-50 transition-colors">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                          <User className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-bold text-slate-800 leading-tight">{emp.emp_name}</div>
                          <div className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> เข้างาน: {emp.checkIn}
                          </div>
                        </div>
                      </div>
                    </div>
                    <StatusBadge eligible={emp.eligible} fullWidth />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Footer Info */}
        <p className="mt-8 text-center text-slate-400 text-sm">
          พบปัญหาการใช้งาน ติดต่อแผนก IT หรือ HR
        </p>
      </main>
    </div>
  );
}

// Sub-component สำหรับ Badge สถานะ
function StatusBadge({ eligible, fullWidth = false }: { eligible: number; fullWidth?: boolean }) {
  const isEligible = eligible === 0;

  return (
    <div className={`
      inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all
      ${fullWidth ? 'w-full mt-2' : ''}
      ${isEligible
        ? 'bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200'
        : 'bg-rose-50 text-rose-600 ring-1 ring-rose-200'}
    `}>
      {isEligible ? (
        <>
          <CheckCircle2 className="w-4 h-4" />
          <span>มีสิทธิ์รับของขวัญ</span>
        </>
      ) : (
        <>
          <XCircle className="w-4 h-4" />
          <span>ไม่มีสิทธิ์</span>
        </>
      )}
    </div>
  );
}