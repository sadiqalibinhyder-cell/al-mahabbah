import React, { useState } from 'react';
import { UserProfile, Programme, Team } from '../types';
import { 
  Users, Search, Filter, Plus, Upload, Download, Trash2, Edit3, 
  CheckCircle2, AlertCircle, Lock, ShieldCheck, Sparkles, UserPlus, RefreshCw, X, ChevronDown, Award
} from 'lucide-react';
import { getCategoryFromClassAndGender } from '../utils/studentUtils';

interface StudentManagementTabProps {
  users: UserProfile[];
  teams: Team[];
  programmes: Programme[];
  onUpdateUsers: (users: UserProfile[]) => void;
}

export const StudentManagementTab: React.FC<StudentManagementTabProps> = ({
  users,
  teams,
  programmes,
  onUpdateUsers
}) => {
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [groupFilter, setGroupFilter] = useState<string>('All');
  const [genderFilter, setGenderFilter] = useState<string>('All');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [classFilter, setClassFilter] = useState<string>('All');

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);

  // Form states
  const [sName, setSName] = useState('');
  const [sGuardian, setSGuardian] = useState('');
  const [sClass, setSClass] = useState('5');
  const [sGender, setSGender] = useState<'Boys' | 'Girls'>('Boys');
  const [sGroup, setSGroup] = useState<'DIRAYA' | 'FUROOHA' | 'SWARAHA'>('DIRAYA');
  const [sChestNo, setSChestNo] = useState('');
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  // Bulk import state
  const [importText, setImportText] = useState('');
  const [importStatus, setImportStatus] = useState('');

  // Filter students list
  const students = users.filter(u => u.role === 'student');

  const filteredStudents = students.filter(s => {
    const sGroupVal = s.group || (s.teamId?.includes('diraya') ? 'DIRAYA' : s.teamId?.includes('furooha') ? 'FUROOHA' : 'SWARAHA');
    const sGenderVal = s.gender || (s.teamId?.includes('girls') ? 'Girls' : 'Boys');
    const sCatVal = s.category || (s.studentClass ? getCategoryFromClassAndGender(s.studentClass, sGenderVal) : 'Junior');
    const sClassVal = s.studentClass || '5';

    if (groupFilter !== 'All' && sGroupVal !== groupFilter) return false;
    if (genderFilter !== 'All' && sGenderVal !== genderFilter) return false;
    if (categoryFilter !== 'All' && sCatVal !== categoryFilter) return false;
    if (classFilter !== 'All' && sClassVal !== classFilter) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = s.name.toLowerCase().includes(q);
      const matchChest = (s.chestNo || '').toLowerCase().includes(q);
      const matchGuardian = (s.guardianName || '').toLowerCase().includes(q);
      return matchName || matchChest || matchGuardian;
    }

    return true;
  });

  // Next available auto chest number
  const generateNextChestNo = (gender: 'Boys' | 'Girls') => {
    const prefix = gender === 'Boys' ? 'B' : 'G';
    const existingChests = students
      .map(s => s.chestNo || '')
      .filter(c => c.startsWith(prefix))
      .map(c => parseInt(c.replace(/\D/g, ''), 10))
      .filter(n => !isNaN(n));
    const nextNum = existingChests.length > 0 ? Math.max(...existingChests) + 1 : 101;
    return `${prefix}${nextNum}`;
  };

  const handleOpenAdd = () => {
    setEditingStudentId(null);
    setSName('');
    setSGuardian('');
    setSClass('5');
    setSGender('Boys');
    setSGroup('DIRAYA');
    setSChestNo(generateNextChestNo('Boys'));
    setFormError('');
    setFormSuccess('');
    setShowAddModal(true);
  };

  const handleOpenEdit = (student: UserProfile) => {
    setEditingStudentId(student.id);
    setSName(student.name);
    setSGuardian(student.guardianName || '');
    setSClass(student.studentClass || '5');
    const genderVal = student.gender || (student.teamId?.includes('girls') ? 'Girls' : 'Boys');
    const groupVal = student.group || (student.teamId?.includes('diraya') ? 'DIRAYA' : student.teamId?.includes('furooha') ? 'FUROOHA' : 'SWARAHA');
    setSGender(genderVal);
    setSGroup(groupVal);
    setSChestNo(student.chestNo || generateNextChestNo(genderVal));
    setFormError('');
    setFormSuccess('');
    setShowAddModal(true);
  };

  const handleSaveStudent = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (!sName.trim()) {
      setFormError('Student Name is required.');
      return;
    }
    if (!sChestNo.trim()) {
      setFormError('Chest Number is required.');
      return;
    }

    // Check chest number uniqueness
    const normalizedChest = sChestNo.trim().toUpperCase();
    const duplicateChest = students.find(s => s.id !== editingStudentId && (s.chestNo || '').toUpperCase() === normalizedChest);
    if (duplicateChest) {
      setFormError(`Chest Number "${normalizedChest}" is already assigned to student ${duplicateChest.name}.`);
      return;
    }

    const teamId = `${sGroup.toLowerCase()}_${sGender.toLowerCase()}`;
    const category = getCategoryFromClassAndGender(sClass, sGender);

    if (editingStudentId) {
      // Edit student
      const updated = users.map(u => u.id === editingStudentId ? {
        ...u,
        name: sName.trim(),
        guardianName: sGuardian.trim(),
        studentClass: sClass,
        gender: sGender,
        group: sGroup,
        category: category,
        teamId: teamId,
        chestNo: normalizedChest,
      } : u);

      onUpdateUsers(updated);
      setFormSuccess(`Student "${sName}" updated successfully!`);
      setTimeout(() => setShowAddModal(false), 1200);
    } else {
      // Add student
      const newStudent: UserProfile = {
        id: `student_${Date.now()}_${Math.floor(100 + Math.random() * 900)}`,
        name: sName.trim(),
        email: `${sName.trim().toLowerCase().replace(/[^a-z0-9]/g, '')}_${Date.now().toString().slice(-4)}@artsportal.edu`,
        role: 'student',
        teamId: teamId,
        registeredProgrammeIds: [],
        rollNo: `ART-${normalizedChest}`,
        chestNo: normalizedChest,
        studentClass: sClass,
        gender: sGender,
        group: sGroup,
        category: category,
        guardianName: sGuardian.trim(),
      };

      onUpdateUsers([...users, newStudent]);
      setFormSuccess(`Student "${sName}" added with Chest No: ${normalizedChest}!`);
      setTimeout(() => setShowAddModal(false), 1200);
    }
  };

  const handleDeleteStudent = (studentId: string, studentName: string) => {
    if (confirm(`Are you sure you want to remove student "${studentName}"?`)) {
      const filtered = users.filter(u => u.id !== studentId);
      onUpdateUsers(filtered);
    }
  };

  // Bulk Import Handler (CSV / JSON)
  const handleBulkImport = () => {
    setImportStatus('');
    if (!importText.trim()) {
      setImportStatus('Please paste CSV or JSON data to import.');
      return;
    }

    try {
      let importedList: Partial<UserProfile>[] = [];

      if (importText.trim().startsWith('[') || importText.trim().startsWith('{')) {
        const parsed = JSON.parse(importText);
        importedList = Array.isArray(parsed) ? parsed : [parsed];
      } else {
        // CSV Parsing
        const lines = importText.trim().split('\n');
        const headers = lines[0].toLowerCase().split(',').map(h => h.trim().replace(/^"|"$/g, ''));
        
        for (let i = 1; i < lines.length; i++) {
          if (!lines[i].trim()) continue;
          const cols = lines[i].split(',').map(c => c.trim().replace(/^"|"$/g, ''));
          const item: any = {};
          
          headers.forEach((h, idx) => {
            const val = cols[idx] || '';
            if (h.includes('name') && !h.includes('guardian')) item.name = val;
            else if (h.includes('guardian') || h.includes('parent')) item.guardianName = val;
            else if (h.includes('class')) item.studentClass = val;
            else if (h.includes('gender')) item.gender = val.toLowerCase().includes('girl') ? 'Girls' : 'Boys';
            else if (h.includes('group')) item.group = val.toUpperCase().includes('FUROOHA') ? 'FUROOHA' : val.toUpperCase().includes('SWARAHA') ? 'SWARAHA' : 'DIRAYA';
            else if (h.includes('chest')) item.chestNo = val;
          });

          if (cols.length >= 2 && !item.name) {
            item.name = cols[0];
            if (cols[1]) item.studentClass = cols[1];
          }

          if (item.name) importedList.push(item);
        }
      }

      if (importedList.length === 0) {
        setImportStatus('No valid student entries found in input.');
        return;
      }

      let newUsersList = [...users];
      let addedCount = 0;

      importedList.forEach(entry => {
        const name = (entry.name || 'Student').trim();
        const gender: 'Boys' | 'Girls' = entry.gender === 'Girls' ? 'Girls' : 'Boys';
        const group: 'DIRAYA' | 'FUROOHA' | 'SWARAHA' = entry.group === 'FUROOHA' ? 'FUROOHA' : entry.group === 'SWARAHA' ? 'SWARAHA' : 'DIRAYA';
        const studentClass = String(entry.studentClass || '5');
        const category = getCategoryFromClassAndGender(studentClass, gender);
        const teamId = `${group.toLowerCase()}_${gender.toLowerCase()}`;

        // Auto chest number if missing or duplicated
        let chestNo = (entry.chestNo || '').trim().toUpperCase();
        if (!chestNo || newUsersList.some(u => u.chestNo === chestNo)) {
          const prefix = gender === 'Boys' ? 'B' : 'G';
          const existingNums = newUsersList
            .map(u => u.chestNo || '')
            .filter(c => c.startsWith(prefix))
            .map(c => parseInt(c.replace(/\D/g, ''), 10))
            .filter(n => !isNaN(n));
          const next = existingNums.length > 0 ? Math.max(...existingNums) + 1 : 101;
          chestNo = `${prefix}${next}`;
        }

        const newStudent: UserProfile = {
          id: `student_import_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`,
          name,
          email: `${name.toLowerCase().replace(/[^a-z0-9]/g, '')}_${chestNo.toLowerCase()}@artsportal.edu`,
          role: 'student',
          teamId,
          registeredProgrammeIds: [],
          rollNo: `ART-${chestNo}`,
          chestNo,
          studentClass,
          gender,
          group,
          category,
          guardianName: (entry.guardianName || '').trim(),
        };

        newUsersList.push(newStudent);
        addedCount++;
      });

      onUpdateUsers(newUsersList);
      setImportStatus(`Successfully imported ${addedCount} students into database!`);
      setImportText('');
      setTimeout(() => setShowImportModal(false), 1500);

    } catch (err: any) {
      setImportStatus(`Import Error: ${err.message}`);
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['ChestNo', 'Name', 'Guardian', 'Gender', 'Group', 'Class', 'Category', 'AssignedProgramsCount'];
    const rows = filteredStudents.map(s => {
      const g = s.group || (s.teamId?.includes('diraya') ? 'DIRAYA' : s.teamId?.includes('furooha') ? 'FUROOHA' : 'SWARAHA');
      const gen = s.gender || (s.teamId?.includes('girls') ? 'Girls' : 'Boys');
      const cat = s.category || getCategoryFromClassAndGender(s.studentClass || '5', gen);
      return [
        `"${s.chestNo || ''}"`,
        `"${s.name}"`,
        `"${s.guardianName || ''}"`,
        `"${gen}"`,
        `"${g}"`,
        `"${s.studentClass || ''}"`,
        `"${cat}"`,
        `"${(s.registeredProgrammeIds || []).length}"`
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `students_roster_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-fade-in" id="admin-student-management-tab">
      
      {/* Header & Stats Banner */}
      <div className="premium-card p-6 md:p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-4">
          <div>
            <span className="text-xs font-sans font-extrabold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest block">
              SYSTEM STUDENT REGISTRY
            </span>
            <h2 className="text-2xl sm:text-3xl font-display font-black text-neutral-900 dark:text-white flex items-center gap-3 mt-1">
              <Users className="text-emerald-500" size={32} />
              Student Management ({students.length} Total Students)
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button 
              onClick={handleOpenAdd}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs tracking-wider flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
            >
              <UserPlus size={16} />
              Add Student
            </button>

            <button 
              onClick={() => setShowImportModal(true)}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-extrabold text-xs tracking-wider flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
            >
              <Upload size={16} />
              Bulk Import
            </button>

            <button 
              onClick={handleExportCSV}
              className="px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-black font-extrabold text-xs tracking-wider flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
            >
              <Download size={16} />
              Export CSV
            </button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
            <div className="text-2xl font-display font-black text-neutral-900 dark:text-white">{students.length}</div>
            <div className="text-[10px] font-sans font-bold text-neutral-400 uppercase tracking-wider">Total Enrolled</div>
          </div>

          <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200/50">
            <div className="text-2xl font-display font-black text-indigo-600 dark:text-indigo-400">
              {students.filter(s => (s.gender || (s.teamId?.includes('girls') ? 'Girls' : 'Boys')) === 'Boys').length}
            </div>
            <div className="text-[10px] font-sans font-bold text-indigo-500 uppercase tracking-wider">Boys Enrolled</div>
          </div>

          <div className="p-4 rounded-2xl bg-pink-50 dark:bg-pink-950/40 border border-pink-200/50">
            <div className="text-2xl font-display font-black text-pink-600 dark:text-pink-400">
              {students.filter(s => (s.gender || (s.teamId?.includes('girls') ? 'Girls' : 'Boys')) === 'Girls').length}
            </div>
            <div className="text-[10px] font-sans font-bold text-pink-500 uppercase tracking-wider">Girls Enrolled</div>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/50">
            <div className="text-2xl font-display font-black text-emerald-600 dark:text-emerald-400">
              {students.filter(s => (s.registeredProgrammeIds || []).length > 0).length}
            </div>
            <div className="text-[10px] font-sans font-bold text-emerald-500 uppercase tracking-wider">Assigned to Events</div>
          </div>
        </div>

        {/* Search & Multi-Filters Toolbar */}
        <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-4">
          <div className="flex flex-col md:flex-row items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3.5 top-3 text-neutral-400" size={16} />
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by Student Name, Chest Number (e.g. B101), or Guardian..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 outline-none text-xs font-semibold text-neutral-900 dark:text-white placeholder-neutral-400"
              />
            </div>

            {/* Filters Row */}
            <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto text-xs font-bold">
              {/* Group Filter */}
              <select 
                value={groupFilter}
                onChange={(e) => setGroupFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 outline-none text-neutral-900 dark:text-white"
              >
                <option value="All">All Groups</option>
                <option value="DIRAYA">DIRAYA</option>
                <option value="FUROOHA">FUROOHA</option>
                <option value="SWARAHA">SWARAHA</option>
              </select>

              {/* Gender Filter */}
              <select 
                value={genderFilter}
                onChange={(e) => setGenderFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 outline-none text-neutral-900 dark:text-white"
              >
                <option value="All">All Genders</option>
                <option value="Boys">Boys Division</option>
                <option value="Girls">Girls Division</option>
              </select>

              {/* Category Filter */}
              <select 
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 outline-none text-neutral-900 dark:text-white"
              >
                <option value="All">All Categories</option>
                <option value="Sub Junior">Sub Junior</option>
                <option value="Junior">Junior</option>
                <option value="Senior">Senior</option>
                <option value="Super Senior">Super Senior (Boys)</option>
              </select>

              {/* Class Filter */}
              <select 
                value={classFilter}
                onChange={(e) => setClassFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 outline-none text-neutral-900 dark:text-white"
              >
                <option value="All">All Classes</option>
                {[3,4,5,6,7,8,9,10,11,12].map(c => (
                  <option key={c} value={String(c)}>Class {c}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Students Table */}
        <div className="overflow-x-auto rounded-2xl border border-neutral-200 dark:border-neutral-800">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-neutral-100 dark:bg-neutral-900 text-[11px] font-mono font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 border-b border-neutral-200 dark:border-neutral-800">
                <th className="p-3.5">Chest No 🔒</th>
                <th className="p-3.5">Student Name</th>
                <th className="p-3.5">Guardian / Parent</th>
                <th className="p-3.5">Group & Gender</th>
                <th className="p-3.5">Class</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Assigned Items</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800 text-xs font-semibold text-neutral-800 dark:text-neutral-200">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((s) => {
                  const sGroupVal = s.group || (s.teamId?.includes('diraya') ? 'DIRAYA' : s.teamId?.includes('furooha') ? 'FUROOHA' : 'SWARAHA');
                  const sGenderVal = s.gender || (s.teamId?.includes('girls') ? 'Girls' : 'Boys');
                  const sCatVal = s.category || getCategoryFromClassAndGender(s.studentClass || '5', sGenderVal);

                  const indCount = (s.registeredProgrammeIds || []).reduce((acc, pId) => {
                    const p = programmes.find(item => item.id === pId);
                    return p && p.type === 'Individual' ? acc + 1 : acc;
                  }, 0);

                  const grpCount = (s.registeredProgrammeIds || []).reduce((acc, pId) => {
                    const p = programmes.find(item => item.id === pId);
                    return p && p.type === 'Group' ? acc + 1 : acc;
                  }, 0);

                  return (
                    <tr key={s.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-900/60 transition-colors">
                      {/* Chest No */}
                      <td className="p-3.5">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 font-mono font-black text-xs border border-amber-400/50 shadow-xs">
                          <Lock size={11} className="text-amber-600" />
                          {s.chestNo || 'N/A'}
                        </span>
                      </td>

                      {/* Name */}
                      <td className="p-3.5 font-bold text-neutral-900 dark:text-white">
                        {s.name}
                      </td>

                      {/* Guardian */}
                      <td className="p-3.5 text-neutral-500">
                        {s.guardianName || '—'}
                      </td>

                      {/* Group & Gender */}
                      <td className="p-3.5">
                        <div className="flex items-center gap-1.5">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                            sGroupVal === 'DIRAYA' ? 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300' :
                            sGroupVal === 'FUROOHA' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' :
                            'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                          }`}>
                            {sGroupVal}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            sGenderVal === 'Boys' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300' : 'bg-pink-100 text-pink-700 dark:bg-pink-950 dark:text-pink-300'
                          }`}>
                            {sGenderVal}
                          </span>
                        </div>
                      </td>

                      {/* Class */}
                      <td className="p-3.5 font-mono font-bold">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span>Class {s.studentClass || '—'}</span>
                          {s.needsClassVerification && (
                            <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 text-[10px] font-bold border border-amber-400/40 inline-flex items-center gap-1">
                              <AlertCircle size={10} className="text-amber-600" /> Verify Class
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Category */}
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded-md bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 text-[10px] font-bold uppercase">
                          {sCatVal}
                        </span>
                      </td>

                      {/* Assigned Items */}
                      <td className="p-3.5 font-mono text-[11px]">
                        <div className="space-y-0.5">
                          <div>
                            <span className={indCount >= 5 ? 'text-rose-600 font-black' : 'text-emerald-600 font-bold'}>
                              Individual: {indCount}/5
                            </span>
                          </div>
                          {grpCount > 0 && (
                            <div className="text-neutral-400">
                              Group: {grpCount} Items
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="p-3.5 text-right space-x-2">
                        <button 
                          onClick={() => handleOpenEdit(s)}
                          className="px-2.5 py-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 transition-all cursor-pointer"
                          title="Edit Student Information & Chest No"
                        >
                          <Edit3 size={14} />
                        </button>
                        <button 
                          onClick={() => handleDeleteStudent(s.id, s.name)}
                          className="px-2.5 py-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/50 text-rose-600 hover:bg-rose-100 transition-all cursor-pointer"
                          title="Delete Student"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-neutral-500">
                    No student records match the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>

      {/* Manual Add / Edit Student Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-white dark:bg-[#1c1c1e] rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl border border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-4">
              <h3 className="text-xl font-display font-black text-neutral-900 dark:text-white flex items-center gap-2">
                <UserPlus className="text-emerald-500" size={24} />
                {editingStudentId ? 'Admin Edit Student Profile' : 'Add New Student Record'}
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-neutral-400 hover:text-neutral-600">
                <X size={20} />
              </button>
            </div>

            {formError && (
              <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 text-rose-600 text-xs font-semibold flex items-center gap-2">
                <AlertCircle size={16} />
                <span>{formError}</span>
              </div>
            )}

            {formSuccess && (
              <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-emerald-600 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 size={16} />
                <span>{formSuccess}</span>
              </div>
            )}

            <form onSubmit={handleSaveStudent} className="space-y-4 text-xs font-semibold">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Chest Number (Admin Controlled) */}
                <div>
                  <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">
                    Chest Number * (Admin Controlled)
                  </label>
                  <input 
                    type="text" 
                    value={sChestNo}
                    onChange={(e) => setSChestNo(e.target.value.toUpperCase())}
                    placeholder="e.g. B101 or G101"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-700 outline-none text-neutral-900 dark:text-white font-mono font-bold"
                    required
                  />
                  <span className="text-[9px] text-amber-600 dark:text-amber-400 mt-1 block">🔒 Chest Number is locked for Team Leaders</span>
                </div>

                {/* Student Full Name */}
                <div>
                  <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">
                    Student Full Name *
                  </label>
                  <input 
                    type="text" 
                    value={sName}
                    onChange={(e) => setSName(e.target.value)}
                    placeholder="e.g. Muhammed Safwan"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 outline-none text-neutral-900 dark:text-white font-bold"
                    required
                  />
                </div>

                {/* Guardian Name */}
                <div>
                  <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">
                    Parent / Guardian Name
                  </label>
                  <input 
                    type="text" 
                    value={sGuardian}
                    onChange={(e) => setSGuardian(e.target.value)}
                    placeholder="e.g. Abdul Rahman"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 outline-none text-neutral-900 dark:text-white"
                  />
                </div>

                {/* Class */}
                <div>
                  <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">
                    Academic Class (3 to 12) *
                  </label>
                  <select 
                    value={sClass}
                    onChange={(e) => setSClass(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 outline-none text-neutral-900 dark:text-white font-mono font-bold"
                  >
                    {[3,4,5,6,7,8,9,10,11,12].map(c => (
                      <option key={c} value={String(c)}>Class {c}</option>
                    ))}
                  </select>
                </div>

                {/* Gender */}
                <div>
                  <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">
                    Gender *
                  </label>
                  <select 
                    value={sGender}
                    onChange={(e) => {
                      const g = e.target.value as 'Boys' | 'Girls';
                      setSGender(g);
                      if (!editingStudentId) setSChestNo(generateNextChestNo(g));
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 outline-none text-neutral-900 dark:text-white font-bold"
                  >
                    <option value="Boys">Boys</option>
                    <option value="Girls">Girls</option>
                  </select>
                </div>

                {/* Group */}
                <div>
                  <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">
                    Group House *
                  </label>
                  <select 
                    value={sGroup}
                    onChange={(e) => setSGroup(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 outline-none text-neutral-900 dark:text-white font-bold"
                  >
                    <option value="DIRAYA">DIRAYA</option>
                    <option value="FUROOHA">FUROOHA</option>
                    <option value="SWARAHA">SWARAHA</option>
                  </select>
                </div>

              </div>

              {/* Auto Category Preview */}
              <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/50 flex items-center justify-between text-xs font-bold text-emerald-800 dark:text-emerald-300">
                <span>Calculated Competition Category:</span>
                <span className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-mono uppercase">
                  {getCategoryFromClassAndGender(sClass, sGender)}
                </span>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-neutral-200 dark:border-neutral-800">
                <button 
                  type="button" 
                  onClick={() => setShowAddModal(false)}
                  className="px-5 py-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 font-bold"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold shadow-md transition-all cursor-pointer"
                >
                  {editingStudentId ? 'Save Profile Changes' : 'Create Student Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bulk Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-2xl bg-white dark:bg-[#1c1c1e] rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl border border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-4">
              <h3 className="text-xl font-display font-black text-neutral-900 dark:text-white flex items-center gap-2">
                <Upload className="text-amber-500" size={24} />
                Bulk Student Import (CSV / JSON)
              </h3>
              <button onClick={() => setShowImportModal(false)} className="text-neutral-400 hover:text-neutral-600">
                <X size={20} />
              </button>
            </div>

            <p className="text-xs text-neutral-500 leading-relaxed font-medium">
              Paste CSV or JSON student list below. Format: <code className="bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded font-mono text-emerald-600">ChestNo, Name, Guardian, Gender, Group, Class</code>
            </p>

            <textarea 
              rows={8}
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              placeholder={`B101, Muhammed Safwan, Abdul Rahman, Boys, DIRAYA, 4\nB102, Ahmed Fasal, Moideen Haji, Boys, DIRAYA, 6\nG101, Fatima Suhra, CH Khader, Girls, FUROOHA, 5`}
              className="w-full p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 font-mono text-xs outline-none text-neutral-900 dark:text-white"
            />

            {importStatus && (
              <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 text-amber-800 dark:text-amber-300 text-xs font-semibold">
                {importStatus}
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-neutral-200 dark:border-neutral-800">
              <span className="text-[11px] text-neutral-400 font-medium">System will auto-assign Chest Numbers if left blank.</span>
              <div className="flex items-center gap-3">
                <button 
                  type="button" 
                  onClick={() => setShowImportModal(false)}
                  className="px-5 py-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 font-bold text-xs"
                >
                  Cancel
                </button>
                <button 
                  type="button"
                  onClick={handleBulkImport}
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-extrabold text-xs shadow-md transition-all cursor-pointer"
                >
                  Import Students Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
