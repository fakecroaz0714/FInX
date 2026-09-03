'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth, Role, CorporateProfile, NGOProfile, CitizenProfile, AdminProfile } from '@/lib/AuthContext';
import {
    ShieldCheck,
    Building2,
    HeartHandshake,
    Users,
    Shield,
    Upload,
    AlertCircle,
    CheckCircle2,
    FileText,
    ArrowRight
} from 'lucide-react';

const CSR_CATEGORIES = [
    'Education',
    'Healthcare',
    'Environment',
    'Sanitation',
    'Rural Development',
    'Women Empowerment',
    'Infrastructure'
];

function SignupContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { signup } = useAuth();

    const paramRole = searchParams.get('role') as Role;
    const initialRole: Role = (paramRole && ['Admin', 'Corporate', 'NGO', 'Citizen'].includes(paramRole))
        ? paramRole
        : 'Corporate';

    const [selectedRole, setSelectedRole] = useState<Role>(initialRole);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Common Account Fields
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [mobile, setMobile] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Corporate Fields
    const [companyName, setCompanyName] = useState('');
    const [registrationNumber, setRegistrationNumber] = useState('');
    const [corporateType, setCorporateType] = useState('Public Limited');
    const [industry, setIndustry] = useState('Technology & IT Services');
    const [website, setWebsite] = useState('');
    const [registeredOffice, setRegisteredOffice] = useState('');
    const [csrContactPerson, setCsrContactPerson] = useState('');
    const [csrContactEmail, setCsrContactEmail] = useState('');
    const [csrBudget, setCsrBudget] = useState('');
    const [selectedCategories, setSelectedCategories] = useState<string[]>(['Education', 'Environment']);
    const [preferredLocations, setPreferredLocations] = useState('');

    // NGO Fields
    const [ngoName, setNgoName] = useState('');
    const [ngoRegNum, setNgoRegNum] = useState('');
    const [ngoRegType, setNgoRegType] = useState('Trust');
    const [registrationDate, setRegistrationDate] = useState('');
    const [pan, setPan] = useState('');
    const [registration12A, setRegistration12A] = useState('');
    const [registration80G, setRegistration80G] = useState('');
    const [darpanId, setDarpanId] = useState('');
    const [ngoWebsite, setNgoWebsite] = useState('');
    const [address, setAddress] = useState('');
    const [ngoState, setNgoState] = useState('Maharashtra');
    const [ngoDistrict, setNgoDistrict] = useState('');
    const [primaryFocusArea, setPrimaryFocusArea] = useState('Sanitation');
    const [areasOfOperation, setAreasOfOperation] = useState('');
    const [yearsOfExperience, setYearsOfExperience] = useState('');
    const [beneficiaryReach, setBeneficiaryReach] = useState('');
    const [previousProjects, setPreviousProjects] = useState('');
    const [uploadedDocs, setUploadedDocs] = useState<Record<string, string>>({
        registrationCert: '',
        panCert: '',
        cert12A: '',
        cert80G: '',
        govProof: ''
    });

    // Citizen Fields
    const [citizenState, setCitizenState] = useState('Maharashtra');
    const [citizenDistrict, setCitizenDistrict] = useState('');
    const [cityVillage, setCityVillage] = useState('');
    const [pincode, setPincode] = useState('');
    const [dob, setDob] = useState('');
    const [preferredLanguage, setPreferredLanguage] = useState('en');

    // Admin Fields
    const [adminId, setAdminId] = useState('');

    const toggleCategory = (category: string) => {
        if (selectedCategories.includes(category)) {
            setSelectedCategories(selectedCategories.filter(c => c !== category));
        } else {
            setSelectedCategories([...selectedCategories, category]);
        }
    };

    const handleFileUpload = (docKey: string, fileName: string) => {
        setUploadedDocs(prev => ({ ...prev, [docKey]: fileName }));
    };

    const validateForm = () => {
        const errs: Record<string, string> = {};

        // Common Account Validation
        if (!name.trim()) errs.name = 'Full name is required.';
        if (!email.trim()) {
            errs.email = 'Email is required.';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
            errs.email = 'Enter a valid email address.';
        }

        if (!mobile.trim()) {
            errs.mobile = 'Mobile number is required.';
        } else if (!/^\d{10}$/.test(mobile.replace(/[^0-9]/g, ''))) {
            errs.mobile = 'Enter a valid 10-digit mobile number.';
        }

        if (!password) {
            errs.password = 'Password is required.';
        } else if (password.length < 6) {
            errs.password = 'Password must be at least 6 characters.';
        }

        if (!confirmPassword) {
            errs.confirmPassword = 'Confirm your password.';
        } else if (password !== confirmPassword) {
            errs.confirmPassword = 'Passwords do not match.';
        }

        // Role-Specific Validation
        if (selectedRole === 'Corporate') {
            if (!companyName.trim()) errs.companyName = 'Company / Organization Name is required.';
            if (!csrBudget) {
                errs.csrBudget = 'Annual CSR Budget is required.';
            } else if (isNaN(Number(csrBudget)) || Number(csrBudget) <= 0) {
                errs.csrBudget = 'Enter a valid numeric budget amount.';
            }
        } else if (selectedRole === 'NGO') {
            if (!ngoName.trim()) errs.ngoName = 'NGO / Organization Name is required.';
            if (!ngoRegNum.trim()) errs.ngoRegNum = 'NGO Registration Number is required.';
            if (!primaryFocusArea) errs.primaryFocusArea = 'Primary focus area is required.';
            if (yearsOfExperience && isNaN(Number(yearsOfExperience))) {
                errs.yearsOfExperience = 'Years of experience must be a number.';
            }
            if (beneficiaryReach && isNaN(Number(beneficiaryReach))) {
                errs.beneficiaryReach = 'Beneficiary reach must be a number.';
            }
        } else if (selectedRole === 'Citizen') {
            if (!citizenState.trim()) errs.citizenState = 'State is required.';
            if (!citizenDistrict.trim()) errs.citizenDistrict = 'District is required.';
        } else if (selectedRole === 'Admin') {
            if (!adminId.trim()) errs.adminId = 'Admin ID / Employee ID is required.';
        }

        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) {
            // Scroll to the first error
            window.scrollTo({ top: 150, behavior: 'smooth' });
            return;
        }

        setIsSubmitting(true);

        try {
            if (selectedRole === 'Corporate') {
                const profile: CorporateProfile = {
                    companyName: companyName.trim(),
                    registrationNumber: registrationNumber.trim() || undefined,
                    corporateType,
                    industry,
                    website: website.trim() || undefined,
                    registeredOffice: registeredOffice.trim() || undefined,
                    csrContactPerson: csrContactPerson.trim() || name.trim(),
                    csrContactEmail: csrContactEmail.trim() || email.trim(),
                    csrBudget: Number(csrBudget) || 0,
                    csrCategories: selectedCategories,
                    preferredLocations: preferredLocations.trim() || undefined
                };

                signup({
                    role: 'Corporate',
                    email: email.trim(),
                    name: name.trim(),
                    mobile: mobile.trim(),
                    profile
                });

                router.push('/corporate-dashboard');
            } else if (selectedRole === 'NGO') {
                const profile: NGOProfile = {
                    organizationName: ngoName.trim(),
                    registrationNumber: ngoRegNum.trim(),
                    registrationType: ngoRegType,
                    registrationDate: registrationDate || undefined,
                    pan: pan.trim() || undefined,
                    registration12A: registration12A.trim() || undefined,
                    registration80G: registration80G.trim() || undefined,
                    darpanId: darpanId.trim() || undefined,
                    website: ngoWebsite.trim() || undefined,
                    address: address.trim() || undefined,
                    state: ngoState,
                    district: ngoDistrict.trim() || undefined,
                    primaryFocusArea,
                    areasOfOperation: areasOfOperation.trim() || undefined,
                    yearsOfExperience: yearsOfExperience ? Number(yearsOfExperience) : undefined,
                    beneficiaryReach: beneficiaryReach ? Number(beneficiaryReach) : undefined,
                    previousProjects: previousProjects.trim() || undefined,
                    documents: uploadedDocs,
                    verificationStatus: 'Pending'
                };

                signup({
                    role: 'NGO',
                    email: email.trim(),
                    name: name.trim(),
                    mobile: mobile.trim(),
                    profile
                });

                router.push('/ngo-dashboard');
            } else if (selectedRole === 'Citizen') {
                const profile: CitizenProfile = {
                    fullName: name.trim(),
                    mobile: mobile.trim(),
                    state: citizenState,
                    district: citizenDistrict.trim(),
                    cityVillage: cityVillage.trim() || undefined,
                    pincode: pincode.trim() || undefined,
                    dob: dob || undefined,
                    preferredLanguage
                };

                signup({
                    role: 'Citizen',
                    email: email.trim(),
                    name: name.trim(),
                    mobile: mobile.trim(),
                    profile
                });

                router.push('/citizen-dashboard');
            } else if (selectedRole === 'Admin') {
                const profile: AdminProfile = {
                    fullName: name.trim(),
                    mobile: mobile.trim(),
                    adminId: adminId.trim(),
                    department: 'CSR Governance & Verification'
                };

                signup({
                    role: 'Admin',
                    email: email.trim(),
                    name: name.trim(),
                    mobile: mobile.trim(),
                    profile
                });

                router.push('/validator');
            }
        } catch (err) {
            console.error('Registration failed:', err);
            setErrors({ general: 'Registration failed. Please review your details and try again.' });
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-14 h-14 bg-indigo-600 rounded-2xl mb-3 shadow-md shadow-indigo-200">
                        <ShieldCheck className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Create your FINX account</h1>
                    <p className="text-sm text-slate-600 mt-2 max-w-md mx-auto">
                        Join India's verified CSR & Milestone Funding Infrastructure. Select your account type to begin onboarding.
                    </p>
                </div>

                {/* Role Selection Tabs */}
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 mb-8">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 text-center sm:text-left">
                        Select Account Type:
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <button
                            type="button"
                            onClick={() => { setSelectedRole('Corporate'); setErrors({}); }}
                            className={`p-3.5 rounded-xl border flex flex-col items-center text-center transition-all ${
                                selectedRole === 'Corporate'
                                    ? 'bg-indigo-50/80 border-indigo-600 ring-2 ring-indigo-500/20 shadow-sm'
                                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                            }`}
                        >
                            <Building2 className={`w-6 h-6 mb-1.5 ${selectedRole === 'Corporate' ? 'text-indigo-600' : 'text-slate-500'}`} />
                            <span className={`text-xs font-bold ${selectedRole === 'Corporate' ? 'text-indigo-900' : 'text-slate-800'}`}>Corporate Funder</span>
                            <span className="text-[10px] text-slate-500 mt-0.5">CSR Mandate & Escrow</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => { setSelectedRole('NGO'); setErrors({}); }}
                            className={`p-3.5 rounded-xl border flex flex-col items-center text-center transition-all ${
                                selectedRole === 'NGO'
                                    ? 'bg-indigo-50/80 border-indigo-600 ring-2 ring-indigo-500/20 shadow-sm'
                                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                            }`}
                        >
                            <HeartHandshake className={`w-6 h-6 mb-1.5 ${selectedRole === 'NGO' ? 'text-indigo-600' : 'text-slate-500'}`} />
                            <span className={`text-xs font-bold ${selectedRole === 'NGO' ? 'text-indigo-900' : 'text-slate-800'}`}>NGO Organization</span>
                            <span className="text-[10px] text-slate-500 mt-0.5">Verified Execution</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => { setSelectedRole('Citizen'); setErrors({}); }}
                            className={`p-3.5 rounded-xl border flex flex-col items-center text-center transition-all ${
                                selectedRole === 'Citizen'
                                    ? 'bg-indigo-50/80 border-indigo-600 ring-2 ring-indigo-500/20 shadow-sm'
                                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                            }`}
                        >
                            <Users className={`w-6 h-6 mb-1.5 ${selectedRole === 'Citizen' ? 'text-indigo-600' : 'text-slate-500'}`} />
                            <span className={`text-xs font-bold ${selectedRole === 'Citizen' ? 'text-indigo-900' : 'text-slate-800'}`}>Citizen / User</span>
                            <span className="text-[10px] text-slate-500 mt-0.5">Village Petitions & Proof</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => { setSelectedRole('Admin'); setErrors({}); }}
                            className={`p-3.5 rounded-xl border flex flex-col items-center text-center transition-all ${
                                selectedRole === 'Admin'
                                    ? 'bg-indigo-50/80 border-indigo-600 ring-2 ring-indigo-500/20 shadow-sm'
                                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                            }`}
                        >
                            <Shield className={`w-6 h-6 mb-1.5 ${selectedRole === 'Admin' ? 'text-indigo-600' : 'text-slate-500'}`} />
                            <span className={`text-xs font-bold ${selectedRole === 'Admin' ? 'text-indigo-900' : 'text-slate-800'}`}>Platform Admin</span>
                            <span className="text-[10px] text-slate-500 mt-0.5">Reviewer & Matcher</span>
                        </button>
                    </div>
                </div>

                {/* Form Error Banner */}
                {Object.keys(errors).length > 0 && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm font-bold text-red-800">Please correct the highlighted fields:</p>
                            <ul className="text-xs text-red-700 mt-1 list-disc list-inside space-y-0.5">
                                {Object.values(errors).slice(0, 3).map((err, i) => (
                                    <li key={i}>{err}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}

                {/* Dynamic Onboarding Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* =========================================================================
                        1. CORPORATE FUNDER ONBOARDING
                       ========================================================================= */}
                    {selectedRole === 'Corporate' && (
                        <>
                            {/* Card 1: Account Information */}
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-4">
                                <div className="border-b border-slate-100 pb-3">
                                    <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                                        <Building2 className="w-5 h-5 text-indigo-600" /> Account Information
                                    </h2>
                                    <p className="text-xs text-slate-500 mt-0.5">Credentials and contact details for the corporate administrator.</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                                            Full Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={e => setName(e.target.value)}
                                            placeholder="e.g. Vikramaditya Sharma"
                                            className={`w-full px-3.5 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none ${errors.name ? 'border-red-400 bg-red-50/40' : 'border-slate-200'}`}
                                        />
                                        {errors.name && <p className="text-[11px] text-red-500 mt-1">{errors.name}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                                            Work Email <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={e => setEmail(e.target.value)}
                                            placeholder="csr@apextechnologies.com"
                                            className={`w-full px-3.5 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none ${errors.email ? 'border-red-400 bg-red-50/40' : 'border-slate-200'}`}
                                        />
                                        {errors.email && <p className="text-[11px] text-red-500 mt-1">{errors.email}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                                            Mobile Number <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="tel"
                                            value={mobile}
                                            onChange={e => setMobile(e.target.value)}
                                            placeholder="10-digit phone number"
                                            className={`w-full px-3.5 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none ${errors.mobile ? 'border-red-400 bg-red-50/40' : 'border-slate-200'}`}
                                        />
                                        {errors.mobile && <p className="text-[11px] text-red-500 mt-1">{errors.mobile}</p>}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                                            Password <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={e => setPassword(e.target.value)}
                                            placeholder="At least 6 characters"
                                            className={`w-full px-3.5 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none ${errors.password ? 'border-red-400 bg-red-50/40' : 'border-slate-200'}`}
                                        />
                                        {errors.password && <p className="text-[11px] text-red-500 mt-1">{errors.password}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                                            Confirm Password <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="password"
                                            value={confirmPassword}
                                            onChange={e => setConfirmPassword(e.target.value)}
                                            placeholder="Re-type your password"
                                            className={`w-full px-3.5 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none ${errors.confirmPassword ? 'border-red-400 bg-red-50/40' : 'border-slate-200'}`}
                                        />
                                        {errors.confirmPassword && <p className="text-[11px] text-red-500 mt-1">{errors.confirmPassword}</p>}
                                    </div>
                                </div>
                            </div>

                            {/* Card 2: Corporate Information */}
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-4">
                                <div className="border-b border-slate-100 pb-3">
                                    <h2 className="text-base font-bold text-slate-900">Corporate Information</h2>
                                    <p className="text-xs text-slate-500 mt-0.5">Company credentials used when publishing CSR opportunities and funding mandates.</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="md:col-span-2">
                                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                                            Company / Organization Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={companyName}
                                            onChange={e => setCompanyName(e.target.value)}
                                            placeholder="e.g. Apex Technologies India Ltd"
                                            className={`w-full px-3.5 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none ${errors.companyName ? 'border-red-400 bg-red-50/40' : 'border-slate-200'}`}
                                        />
                                        {errors.companyName && <p className="text-[11px] text-red-500 mt-1">{errors.companyName}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                                            Company Registration Number / CIN
                                        </label>
                                        <input
                                            type="text"
                                            value={registrationNumber}
                                            onChange={e => setRegistrationNumber(e.target.value)}
                                            placeholder="e.g. L72200MH2005PLC154872"
                                            className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none font-mono"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 mb-1">Corporate Type</label>
                                        <select
                                            value={corporateType}
                                            onChange={e => setCorporateType(e.target.value)}
                                            className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                                        >
                                            <option>Public Limited</option>
                                            <option>Private Limited</option>
                                            <option>Multinational Corporation (MNC)</option>
                                            <option>Public Sector Undertaking (PSU)</option>
                                            <option>Other</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 mb-1">Industry / Sector</label>
                                        <input
                                            type="text"
                                            value={industry}
                                            onChange={e => setIndustry(e.target.value)}
                                            placeholder="e.g. Technology, Manufacturing, Energy"
                                            className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 mb-1">Company Website</label>
                                        <input
                                            type="url"
                                            value={website}
                                            onChange={e => setWebsite(e.target.value)}
                                            placeholder="https://company.com"
                                            className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-xs font-semibold text-slate-700 mb-1">Registered Office Location</label>
                                        <input
                                            type="text"
                                            value={registeredOffice}
                                            onChange={e => setRegisteredOffice(e.target.value)}
                                            placeholder="City, State (e.g. Mumbai, Maharashtra)"
                                            className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 mb-1">CSR Contact Person</label>
                                        <input
                                            type="text"
                                            value={csrContactPerson}
                                            onChange={e => setCsrContactPerson(e.target.value)}
                                            placeholder="Designated CSR Officer"
                                            className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 mb-1">CSR Contact Email</label>
                                        <input
                                            type="email"
                                            value={csrContactEmail}
                                            onChange={e => setCsrContactEmail(e.target.value)}
                                            placeholder="csr-office@company.com"
                                            className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Card 3: CSR Information */}
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-4">
                                <div className="border-b border-slate-100 pb-3">
                                    <h2 className="text-base font-bold text-slate-900">CSR Information</h2>
                                    <p className="text-xs text-slate-500 mt-0.5">Budget allocations and mandate focus categories.</p>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                                            Annual CSR Budget (in INR ₹) <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <span className="absolute left-3.5 top-2.5 text-slate-400 font-bold text-sm">₹</span>
                                            <input
                                                type="number"
                                                value={csrBudget}
                                                onChange={e => setCsrBudget(e.target.value)}
                                                placeholder="e.g. 50000000 (5 Crore)"
                                                className={`w-full pl-8 pr-3.5 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none font-mono ${errors.csrBudget ? 'border-red-400 bg-red-50/40' : 'border-slate-200'}`}
                                            />
                                        </div>
                                        {errors.csrBudget && <p className="text-[11px] text-red-500 mt-1">{errors.csrBudget}</p>}
                                        <p className="text-[11px] text-slate-400 mt-1">This budget will be accessible directly when publishing new verified milestone opportunities.</p>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 mb-2">Preferred CSR Categories</label>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                                            {CSR_CATEGORIES.map(cat => {
                                                const isChecked = selectedCategories.includes(cat);
                                                return (
                                                    <button
                                                        type="button"
                                                        key={cat}
                                                        onClick={() => toggleCategory(cat)}
                                                        className={`px-3 py-2 rounded-lg text-xs font-semibold text-left transition-all border flex items-center justify-between ${
                                                            isChecked
                                                                ? 'bg-indigo-50 border-indigo-600 text-indigo-800'
                                                                : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                                                        }`}
                                                    >
                                                        <span>{cat}</span>
                                                        {isChecked && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 mb-1">Preferred Project Locations</label>
                                        <input
                                            type="text"
                                            value={preferredLocations}
                                            onChange={e => setPreferredLocations(e.target.value)}
                                            placeholder="e.g. Maharashtra, Karnataka, Telangana, Bihar"
                                            className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                        />
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {/* =========================================================================
                        2. NGO ORGANIZATION ONBOARDING
                       ========================================================================= */}
                    {selectedRole === 'NGO' && (
                        <>
                            {/* Card 1: Authorized Person */}
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-4">
                                <div className="border-b border-slate-100 pb-3">
                                    <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                                        <HeartHandshake className="w-5 h-5 text-indigo-600" /> Authorized Person
                                    </h2>
                                    <p className="text-xs text-slate-500 mt-0.5">Authorized signatory or coordinator details.</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                                            Authorized Person Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={e => setName(e.target.value)}
                                            placeholder="e.g. Dr. Sunita Kulkarni"
                                            className={`w-full px-3.5 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none ${errors.name ? 'border-red-400 bg-red-50/40' : 'border-slate-200'}`}
                                        />
                                        {errors.name && <p className="text-[11px] text-red-500 mt-1">{errors.name}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                                            Official Email <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={e => setEmail(e.target.value)}
                                            placeholder="contact@ngo-trust.org"
                                            className={`w-full px-3.5 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none ${errors.email ? 'border-red-400 bg-red-50/40' : 'border-slate-200'}`}
                                        />
                                        {errors.email && <p className="text-[11px] text-red-500 mt-1">{errors.email}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                                            Mobile Number <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="tel"
                                            value={mobile}
                                            onChange={e => setMobile(e.target.value)}
                                            placeholder="10-digit mobile number"
                                            className={`w-full px-3.5 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none ${errors.mobile ? 'border-red-400 bg-red-50/40' : 'border-slate-200'}`}
                                        />
                                        {errors.mobile && <p className="text-[11px] text-red-500 mt-1">{errors.mobile}</p>}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                                            Password <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={e => setPassword(e.target.value)}
                                            placeholder="At least 6 characters"
                                            className={`w-full px-3.5 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none ${errors.password ? 'border-red-400 bg-red-50/40' : 'border-slate-200'}`}
                                        />
                                        {errors.password && <p className="text-[11px] text-red-500 mt-1">{errors.password}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                                            Confirm Password <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="password"
                                            value={confirmPassword}
                                            onChange={e => setConfirmPassword(e.target.value)}
                                            placeholder="Re-type your password"
                                            className={`w-full px-3.5 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none ${errors.confirmPassword ? 'border-red-400 bg-red-50/40' : 'border-slate-200'}`}
                                        />
                                        {errors.confirmPassword && <p className="text-[11px] text-red-500 mt-1">{errors.confirmPassword}</p>}
                                    </div>
                                </div>
                            </div>

                            {/* Card 2: NGO Verification Information */}
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-4">
                                <div className="border-b border-slate-100 pb-3">
                                    <h2 className="text-base font-bold text-slate-900">NGO Verification Information</h2>
                                    <p className="text-xs text-slate-500 mt-0.5">Government registration and legal compliance IDs.</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="md:col-span-2">
                                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                                            NGO / Organization Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={ngoName}
                                            onChange={e => setNgoName(e.target.value)}
                                            placeholder="e.g. Jal Seva Foundation"
                                            className={`w-full px-3.5 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none ${errors.ngoName ? 'border-red-400 bg-red-50/40' : 'border-slate-200'}`}
                                        />
                                        {errors.ngoName && <p className="text-[11px] text-red-500 mt-1">{errors.ngoName}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                                            NGO Registration Number <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={ngoRegNum}
                                            onChange={e => setNgoRegNum(e.target.value)}
                                            placeholder="e.g. TR-2015-893"
                                            className={`w-full px-3.5 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none font-mono ${errors.ngoRegNum ? 'border-red-400 bg-red-50/40' : 'border-slate-200'}`}
                                        />
                                        {errors.ngoRegNum && <p className="text-[11px] text-red-500 mt-1">{errors.ngoRegNum}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 mb-1">NGO Registration Type</label>
                                        <select
                                            value={ngoRegType}
                                            onChange={e => setNgoRegType(e.target.value)}
                                            className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                                        >
                                            <option>Trust</option>
                                            <option>Society</option>
                                            <option>Section 8 Company</option>
                                            <option>Other</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 mb-1">Registration Date</label>
                                        <input
                                            type="date"
                                            value={registrationDate}
                                            onChange={e => setRegistrationDate(e.target.value)}
                                            className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 mb-1">PAN Number</label>
                                        <input
                                            type="text"
                                            value={pan}
                                            onChange={e => setPan(e.target.value.toUpperCase())}
                                            placeholder="AAATJ9999K"
                                            className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none font-mono uppercase"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 mb-1">12A Registration Number</label>
                                        <input
                                            type="text"
                                            value={registration12A}
                                            onChange={e => setRegistration12A(e.target.value)}
                                            placeholder="12A-PUN-2016-778"
                                            className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none font-mono"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 mb-1">80G Registration Number</label>
                                        <input
                                            type="text"
                                            value={registration80G}
                                            onChange={e => setRegistration80G(e.target.value)}
                                            placeholder="80G-PUN-2016-992"
                                            className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none font-mono"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 mb-1">Darpan ID / Government NGO ID</label>
                                        <input
                                            type="text"
                                            value={darpanId}
                                            onChange={e => setDarpanId(e.target.value)}
                                            placeholder="MH/2016/0109283"
                                            className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none font-mono"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 mb-1">Official Website</label>
                                        <input
                                            type="url"
                                            value={ngoWebsite}
                                            onChange={e => setNgoWebsite(e.target.value)}
                                            placeholder="https://jalseva.org"
                                            className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-xs font-semibold text-slate-700 mb-1">Registered Address</label>
                                        <input
                                            type="text"
                                            value={address}
                                            onChange={e => setAddress(e.target.value)}
                                            placeholder="Street, Office Number, Locality"
                                            className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 mb-1">State</label>
                                        <input
                                            type="text"
                                            value={ngoState}
                                            onChange={e => setNgoState(e.target.value)}
                                            placeholder="e.g. Maharashtra"
                                            className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 mb-1">District</label>
                                        <input
                                            type="text"
                                            value={ngoDistrict}
                                            onChange={e => setNgoDistrict(e.target.value)}
                                            placeholder="e.g. Pune"
                                            className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Card 3: Organization Details */}
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-4">
                                <div className="border-b border-slate-100 pb-3">
                                    <h2 className="text-base font-bold text-slate-900">Organization Details & Experience</h2>
                                    <p className="text-xs text-slate-500 mt-0.5">Execution track record and core focus.</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                                            Primary Focus Area <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            value={primaryFocusArea}
                                            onChange={e => setPrimaryFocusArea(e.target.value)}
                                            className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                                        >
                                            {CSR_CATEGORIES.map(c => (
                                                <option key={c} value={c}>{c}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 mb-1">Areas of Operation</label>
                                        <input
                                            type="text"
                                            value={areasOfOperation}
                                            onChange={e => setAreasOfOperation(e.target.value)}
                                            placeholder="e.g. Rural Pune & Western Ghats"
                                            className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 mb-1">Years of Experience</label>
                                        <input
                                            type="number"
                                            value={yearsOfExperience}
                                            onChange={e => setYearsOfExperience(e.target.value)}
                                            placeholder="e.g. 9"
                                            className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none font-mono"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 mb-1">Approximate Beneficiary Reach</label>
                                        <input
                                            type="number"
                                            value={beneficiaryReach}
                                            onChange={e => setBeneficiaryReach(e.target.value)}
                                            placeholder="e.g. 45000"
                                            className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none font-mono"
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-xs font-semibold text-slate-700 mb-1">Previous CSR Projects</label>
                                        <textarea
                                            rows={2}
                                            value={previousProjects}
                                            onChange={e => setPreviousProjects(e.target.value)}
                                            placeholder="Brief summary of successfully delivered community programs..."
                                            className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Card 4: Document Uploads / Verification Proofs */}
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-4">
                                <div className="border-b border-slate-100 pb-3">
                                    <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                                        <FileText className="w-5 h-5 text-indigo-600" /> Compliance Documents (Proof)
                                    </h2>
                                    <p className="text-xs text-slate-500 mt-0.5">Upload or attach digital verification certificates (PDF or scans).</p>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {[
                                        { key: 'registrationCert', label: 'Registration Certificate' },
                                        { key: 'panCert', label: 'PAN Certificate' },
                                        { key: 'cert12A', label: '12A Certificate' },
                                        { key: 'cert80G', label: '80G Certificate' },
                                        { key: 'govProof', label: 'Government NGO Registration Proof' }
                                    ].map(doc => (
                                        <div key={doc.key} className="border border-slate-200 rounded-xl p-3.5 flex items-center justify-between gap-3 bg-slate-50/50">
                                            <div className="min-w-0">
                                                <p className="text-xs font-bold text-slate-800 truncate">{doc.label}</p>
                                                <p className="text-[11px] text-slate-500 truncate">
                                                    {uploadedDocs[doc.key] ? (
                                                        <span className="text-emerald-600 font-semibold flex items-center gap-1">
                                                            <CheckCircle2 className="w-3 h-3" /> {uploadedDocs[doc.key]}
                                                        </span>
                                                    ) : (
                                                        'Required for level 2 validation'
                                                    )}
                                                </p>
                                            </div>
                                            <label className="cursor-pointer shrink-0 bg-white border border-indigo-200 text-indigo-600 hover:bg-indigo-50 px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors">
                                                <Upload className="w-3 h-3" />
                                                <span>{uploadedDocs[doc.key] ? 'Change' : 'Upload'}</span>
                                                <input
                                                    type="file"
                                                    className="hidden"
                                                    accept=".pdf,.jpg,.png"
                                                    onChange={e => {
                                                        const file = e.target.files?.[0];
                                                        if (file) handleFileUpload(doc.key, file.name);
                                                    }}
                                                />
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}

                    {/* =========================================================================
                        3. CITIZEN / USER ONBOARDING
                       ========================================================================= */}
                    {selectedRole === 'Citizen' && (
                        <>
                            {/* Card 1: Personal Information */}
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-4">
                                <div className="border-b border-slate-100 pb-3">
                                    <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                                        <Users className="w-5 h-5 text-indigo-600" /> Personal Information
                                    </h2>
                                    <p className="text-xs text-slate-500 mt-0.5">Your profile for submitting local petitions and voting on verified initiatives.</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                                            Full Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={e => setName(e.target.value)}
                                            placeholder="e.g. Ramesh Patil"
                                            className={`w-full px-3.5 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none ${errors.name ? 'border-red-400 bg-red-50/40' : 'border-slate-200'}`}
                                        />
                                        {errors.name && <p className="text-[11px] text-red-500 mt-1">{errors.name}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                                            Email Address <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={e => setEmail(e.target.value)}
                                            placeholder="ramesh.patil@gramin.in"
                                            className={`w-full px-3.5 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none ${errors.email ? 'border-red-400 bg-red-50/40' : 'border-slate-200'}`}
                                        />
                                        {errors.email && <p className="text-[11px] text-red-500 mt-1">{errors.email}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                                            Mobile Number <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="tel"
                                            value={mobile}
                                            onChange={e => setMobile(e.target.value)}
                                            placeholder="10-digit mobile number"
                                            className={`w-full px-3.5 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none ${errors.mobile ? 'border-red-400 bg-red-50/40' : 'border-slate-200'}`}
                                        />
                                        {errors.mobile && <p className="text-[11px] text-red-500 mt-1">{errors.mobile}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 mb-1">Date of Birth (Optional)</label>
                                        <input
                                            type="date"
                                            value={dob}
                                            onChange={e => setDob(e.target.value)}
                                            className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                                            Password <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={e => setPassword(e.target.value)}
                                            placeholder="At least 6 characters"
                                            className={`w-full px-3.5 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none ${errors.password ? 'border-red-400 bg-red-50/40' : 'border-slate-200'}`}
                                        />
                                        {errors.password && <p className="text-[11px] text-red-500 mt-1">{errors.password}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                                            Confirm Password <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="password"
                                            value={confirmPassword}
                                            onChange={e => setConfirmPassword(e.target.value)}
                                            placeholder="Re-type your password"
                                            className={`w-full px-3.5 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none ${errors.confirmPassword ? 'border-red-400 bg-red-50/40' : 'border-slate-200'}`}
                                        />
                                        {errors.confirmPassword && <p className="text-[11px] text-red-500 mt-1">{errors.confirmPassword}</p>}
                                    </div>
                                </div>
                            </div>

                            {/* Card 2: Location Information */}
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-4">
                                <div className="border-b border-slate-100 pb-3">
                                    <h2 className="text-base font-bold text-slate-900">Location & Region</h2>
                                    <p className="text-xs text-slate-500 mt-0.5">Helps route your community issues to relevant regional CSR funds and local NGOs.</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                                            State <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={citizenState}
                                            onChange={e => setCitizenState(e.target.value)}
                                            placeholder="e.g. Maharashtra"
                                            className={`w-full px-3.5 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none ${errors.citizenState ? 'border-red-400 bg-red-50/40' : 'border-slate-200'}`}
                                        />
                                        {errors.citizenState && <p className="text-[11px] text-red-500 mt-1">{errors.citizenState}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                                            District <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={citizenDistrict}
                                            onChange={e => setCitizenDistrict(e.target.value)}
                                            placeholder="e.g. Pune"
                                            className={`w-full px-3.5 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none ${errors.citizenDistrict ? 'border-red-400 bg-red-50/40' : 'border-slate-200'}`}
                                        />
                                        {errors.citizenDistrict && <p className="text-[11px] text-red-500 mt-1">{errors.citizenDistrict}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 mb-1">City / Village</label>
                                        <input
                                            type="text"
                                            value={cityVillage}
                                            onChange={e => setCityVillage(e.target.value)}
                                            placeholder="e.g. Shirur Village"
                                            className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 mb-1">Pincode</label>
                                        <input
                                            type="text"
                                            value={pincode}
                                            onChange={e => setPincode(e.target.value)}
                                            placeholder="e.g. 412210"
                                            className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none font-mono"
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-xs font-semibold text-slate-700 mb-1">Preferred Language</label>
                                        <select
                                            value={preferredLanguage}
                                            onChange={e => setPreferredLanguage(e.target.value)}
                                            className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                                        >
                                            <option value="en">English</option>
                                            <option value="hi">हिन्दी (Hindi)</option>
                                            <option value="mr">मराठी (Marathi)</option>
                                            <option value="ta">தமிழ் (Tamil)</option>
                                            <option value="te">తెలుగు (Telugu)</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {/* =========================================================================
                        4. PLATFORM ADMIN ONBOARDING
                       ========================================================================= */}
                    {selectedRole === 'Admin' && (
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-4">
                            <div className="border-b border-slate-100 pb-3">
                                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                                    <Shield className="w-5 h-5 text-indigo-600" /> Platform Admin Registration
                                </h2>
                                <p className="text-xs text-slate-500 mt-0.5">Secure registration for authorized FINX platform verifiers and reviewers.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                                        Full Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={e => setName(e.target.value)}
                                        placeholder="Admin Full Name"
                                        className={`w-full px-3.5 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none ${errors.name ? 'border-red-400 bg-red-50/40' : 'border-slate-200'}`}
                                    />
                                    {errors.name && <p className="text-[11px] text-red-500 mt-1">{errors.name}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                                        Official/Admin Email <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        placeholder="officer@finx.gov.in"
                                        className={`w-full px-3.5 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none ${errors.email ? 'border-red-400 bg-red-50/40' : 'border-slate-200'}`}
                                    />
                                    {errors.email && <p className="text-[11px] text-red-500 mt-1">{errors.email}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                                        Mobile Number <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="tel"
                                        value={mobile}
                                        onChange={e => setMobile(e.target.value)}
                                        placeholder="10-digit mobile number"
                                        className={`w-full px-3.5 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none ${errors.mobile ? 'border-red-400 bg-red-50/40' : 'border-slate-200'}`}
                                    />
                                    {errors.mobile && <p className="text-[11px] text-red-500 mt-1">{errors.mobile}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                                        Admin ID / Employee ID <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={adminId}
                                        onChange={e => setAdminId(e.target.value)}
                                        placeholder="e.g. ADM-2024-912"
                                        className={`w-full px-3.5 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none font-mono ${errors.adminId ? 'border-red-400 bg-red-50/40' : 'border-slate-200'}`}
                                    />
                                    {errors.adminId && <p className="text-[11px] text-red-500 mt-1">{errors.adminId}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                                        Password <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        placeholder="At least 6 characters"
                                        className={`w-full px-3.5 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none ${errors.password ? 'border-red-400 bg-red-50/40' : 'border-slate-200'}`}
                                    />
                                    {errors.password && <p className="text-[11px] text-red-500 mt-1">{errors.password}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                                        Confirm Password <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={e => setConfirmPassword(e.target.value)}
                                        placeholder="Re-type your password"
                                        className={`w-full px-3.5 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none ${errors.confirmPassword ? 'border-red-400 bg-red-50/40' : 'border-slate-200'}`}
                                    />
                                    {errors.confirmPassword && <p className="text-[11px] text-red-500 mt-1">{errors.confirmPassword}</p>}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Submit Button */}
                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-3.5 px-6 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-xl font-bold transition-all shadow-md shadow-indigo-200 flex items-center justify-center gap-2 text-sm cursor-pointer"
                        >
                            {isSubmitting ? (
                                <span>Registering Account...</span>
                            ) : (
                                <>
                                    <span>Complete {selectedRole === 'NGO' ? 'NGO' : selectedRole} Registration</span>
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </div>
                </form>

                {/* Footer Switch to Login */}
                <div className="text-center mt-8 text-sm text-slate-500">
                    Already have a FINX account?{' '}
                    <Link
                        href={`/auth/login?role=${selectedRole}`}
                        className="text-indigo-600 hover:underline font-bold"
                    >
                        Sign in here
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default function SignupPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-slate-500 text-sm">Loading registration...</div>}>
            <SignupContent />
        </Suspense>
    );
}
