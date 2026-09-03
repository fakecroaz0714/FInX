'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'hi' | 'mr' | 'ta' | 'te';

export interface LanguageContextType {
    lang: Language;
    setLang: (lang: Language) => void;
    t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
    en: {
        // App Core
        platform_title: 'FINX CSR Accountability',
        active_role: 'Active Role',
        select_language: 'Select Language',
        
        // Navigation
        nav_dashboard: 'Dashboard',
        nav_verified_milestones: 'Verified Milestones',
        nav_ngo_validation: 'NGO Validation',
        nav_escrow: 'Escrow Controls',
        nav_demo: 'On-Chain Demo',
        nav_impact: 'Impact Reports',
        nav_csr_matches: 'CSR Matches',
        nav_corporate_dir: 'Corporate Partners',
        nav_ngo_dir: 'NGO Network',
        nav_petitions: 'Village Petitions',
        nav_submit_evidence: 'Submit Evidence',

        // Dashboard Roles & Banners
        admin_dashboard_title: 'Platform Governance & Risk Oversight',
        admin_dashboard_sub: 'Real-time CSR accountability, risk flags & verification oversight.',
        corp_dashboard_title: 'Corporate CSR Funding Control',
        corp_dashboard_sub: 'Manage project milestone funding & authorize verified tranche releases.',
        ngo_dashboard_title: 'NGO Partner & Field Inspection Workspace',
        ngo_dashboard_sub: 'Field inspection, geotagged evidence submission & milestone tracking.',
        citizen_dashboard_title: 'Community Voice & Village Hub',
        citizen_dashboard_sub: 'Submit community petitions, track village projects & verify public impact.',

        // Core Principle Banners
        status_locked_banner: 'FUNDING STATUS: LOCKED — WAITING FOR VERIFIED PROGRESS',
        status_verified_banner: 'MILESTONE VERIFIED — NEXT FUNDING STAGE UNLOCKED',
        status_blocked_banner: 'FUNDING STATUS: BLOCKED — FRAUD OR LOCATION MISMATCH DETECTED',

        // Metrics
        metric_approved_budget: 'Approved Budget',
        metric_released_amount: 'Released Amount',
        metric_locked_amount: 'Locked Amount',
        metric_current_stage: 'Current Stage',
        metric_verification_score: 'Verification Score',
        metric_risk_level: 'Risk Level',
        metric_physical_progress: 'Physical Progress',

        // Buttons
        btn_open_engine: 'Open Verification Engine',
        btn_submit_evidence: 'Submit Milestone Evidence',
        btn_release_funds: 'Release Funds',
        btn_inspect: 'Inspect',
        btn_approve: 'Approve Milestone',
        btn_reject: 'Reject Evidence',
        btn_flag: 'Flag for Audit',
        btn_revision: 'Request Revision',
        btn_demo_gps: '🚨 Trigger GPS Mismatch Demo',
        btn_demo_dup: '🔄 Trigger Duplicate Image Demo',
        btn_demo_valid: '✅ Submit Valid Verification',
        btn_reset: 'Reset Environment',
    },
    hi: {
        // App Core (Hindi)
        platform_title: 'FINX सीएसआर जवाबदेही',
        active_role: 'सक्रिय भूमिका',
        select_language: 'भाषा चुनें',

        // Navigation
        nav_dashboard: 'डैशबोर्ड',
        nav_verified_milestones: 'सत्यापित मील का पत्थर',
        nav_ngo_validation: 'एनजीओ सत्यापन',
        nav_escrow: 'एस्क्रौ नियंत्रण',
        nav_demo: 'ऑन-चेन डेमो',
        nav_impact: 'प्रभाव रिपोर्ट',
        nav_csr_matches: 'सीएसआर मैच',
        nav_corporate_dir: 'कॉर्पोरेट भागीदार',
        nav_ngo_dir: 'एनजीओ नेटवर्क',
        nav_petitions: 'ग्राम याचिकाएं',
        nav_submit_evidence: 'प्रमाण जमा करें',

        // Dashboard Roles & Banners
        admin_dashboard_title: 'प्लेटफ़ॉर्म प्रशासन एवं जोखिम निगरानी',
        admin_dashboard_sub: 'वास्तविक समय सीएसआर जवाबदेही और सत्यापन निगरानी।',
        corp_dashboard_title: 'कॉर्पोरेट सीएसआर फंडिंग नियंत्रण',
        corp_dashboard_sub: 'परियोजना मील के पत्थर की फंडिंग प्रबंधित करें और किश्तों को अधिकृत करें।',
        ngo_dashboard_title: 'एनजीओ भागीदार और क्षेत्र निरीक्षण कार्यक्षेत्र',
        ngo_dashboard_sub: 'क्षेत्र निरीक्षण, जियोटैग किए गए साक्ष्य जमा करना।',
        citizen_dashboard_title: 'सामुदायिक आवाज एवं ग्राम हब',
        citizen_dashboard_sub: 'ग्राम याचिकाएं जमा करें और सार्वजनिक प्रभाव की जांच करें।',

        // Core Principle Banners
        status_locked_banner: 'फंडिंग स्थिति: बंद — सत्यापित प्रगति की प्रतीक्षा है',
        status_verified_banner: 'मील का पत्थर सत्यापित — अगला फंडिंग चरण अनलॉक हुआ',
        status_blocked_banner: 'फंडिंग स्थिति: अवरुद्ध — स्थान बेमेल या धोखाधड़ी पाई गई',

        // Metrics
        metric_approved_budget: 'स्वीकृत बजट',
        metric_released_amount: 'जारी की गई राशि',
        metric_locked_amount: 'एस्क्रौ में लॉक राशि',
        metric_current_stage: 'वर्तमान चरण',
        metric_verification_score: 'सत्यापन स्कोर',
        metric_risk_level: 'जोखिम स्तर',
        metric_physical_progress: 'भौतिक प्रगति',

        // Buttons
        btn_open_engine: 'सत्यापन इंजन खोलें',
        btn_submit_evidence: 'मील का पत्थर प्रमाण जमा करें',
        btn_release_funds: 'फंड जारी करें',
        btn_inspect: 'निरीक्षण करें',
        btn_approve: 'स्वीकृत करें',
        btn_reject: 'अस्वीकार करें',
        btn_flag: 'ऑडिट के लिए फ्लैग करें',
        btn_revision: 'संशोधन का अनुरोध करें',
        btn_demo_gps: '🚨 जीपीएस बेमेल डेमो चलाएं',
        btn_demo_dup: '🔄 डुप्लिकेट छवि डेमो चलाएं',
        btn_demo_valid: '✅ वैध सत्यापन जमा करें',
        btn_reset: 'रीसेट करें',
    },
    mr: {
        // App Core (Marathi)
        platform_title: 'FINX सीएसआर उत्तरदायित्व',
        active_role: 'सक्रिय भूमिका',
        select_language: 'भाषा निवडा',

        // Navigation
        nav_dashboard: 'डॅशबोर्ड',
        nav_verified_milestones: 'पडताळलेले टप्पे',
        nav_ngo_validation: 'एनजीओ पडताळणी',
        nav_escrow: 'एस्क्रौ नियंत्रणे',
        nav_demo: 'ऑन-चेन प्रात्यक्षिक',
        nav_impact: 'प्रभाव अहवाल',
        nav_csr_matches: 'सीएसआर सामने',
        nav_corporate_dir: 'कॉर्पोरेट भागीदार',
        nav_ngo_dir: 'एनजीओ नेटवर्क',
        nav_petitions: 'ग्राम याचिका',
        nav_submit_evidence: 'पुरावा सबमिट करा',

        // Dashboard Roles & Banners
        admin_dashboard_title: 'प्लॅटफॉर्म प्रशासन आणि धोका नियंत्रण',
        admin_dashboard_sub: 'रिअल-टाइम सीएसआर उत्तरदायित्व आणि पडताळणी नियंत्रण.',
        corp_dashboard_title: 'कॉर्पोरेट सीएसआर निधी नियंत्रण',
        corp_dashboard_sub: 'प्रकल्पाच्या टप्प्यांचा निधी व्यवस्थापित करा.',
        ngo_dashboard_title: 'एनजीओ भागीदार आणि क्षेत्र पाहणी कार्यक्षेत्र',
        ngo_dashboard_sub: 'क्षेत्र पाहणी, जिओटॅग केलेले पुरावे सबमिट करा.',
        citizen_dashboard_title: 'लोकशाही आवाज आणि ग्राम केंद्र',
        citizen_dashboard_sub: 'ग्राम याचिका सबमिट करा आणि सार्वजनिक प्रभाव तपासा.',

        // Core Principle Banners
        status_locked_banner: 'निधी स्थिती: लॉक — पडताळणी केलेल्या प्रगतीची वाट पाहत आहे',
        status_verified_banner: 'टप्पा पडताळला गेला — पुढील निधी टप्पा अनलॉक झाला',
        status_blocked_banner: 'निधी स्थिती: ब्लॉक — स्थान तफावत किंवा फसवणूक आढळली',

        // Metrics
        metric_approved_budget: 'मंजूर अर्थसंकल्प',
        metric_released_amount: 'वितरित केलेली रक्कम',
        metric_locked_amount: 'सुरक्षित रक्कम',
        metric_current_stage: 'सध्याचा टप्पा',
        metric_verification_score: 'पडताळणी गुण',
        metric_risk_level: 'धोका पातळी',
        metric_physical_progress: 'प्रत्यक्ष प्रगती',

        // Buttons
        btn_open_engine: 'पडताळणी इंजिन उघडा',
        btn_submit_evidence: 'टप्पा पुरावा सबमिट करा',
        btn_release_funds: 'निधी वितरित करा',
        btn_inspect: 'पाहणी करा',
        btn_approve: 'मान्यता द्या',
        btn_reject: 'नाकारा',
        btn_flag: 'तपासणीसाठी चिन्हांकित करा',
        btn_revision: 'दुरुस्तीची विनंती करा',
        btn_demo_gps: '🚨 जीपीएस तफावत प्रात्यक्षिक',
        btn_demo_dup: '🔄 डुप्लिकेट फोटो प्रात्यक्षिक',
        btn_demo_valid: '✅ वैध पडताळणी सबमिट करा',
        btn_reset: 'रीसेट करा',
    },
    ta: {
        // App Core (Tamil)
        platform_title: 'FINX CSR பொறுப்புடைமை',
        active_role: 'செயலில் உள்ள பங்கு',
        select_language: 'மொழியைத் தேர்ந்தெடுக்கவும்',

        // Navigation
        nav_dashboard: 'முகப்பு',
        nav_verified_milestones: 'சரிபார்க்கப்பட்ட மைல்கற்கள்',
        nav_ngo_validation: 'அரசு சாரா நிறுவனம் சரிபார்ப்பு',
        nav_escrow: 'எஸ்க்ரோ கட்டுப்பாடுகள்',
        nav_demo: 'செயல்திட்ட செய்முறை',
        nav_impact: 'தாக்க அறிக்கைகள்',
        nav_csr_matches: 'CSR இணைப்புகள்',
        nav_corporate_dir: 'நிறுவன கூட்டாளர்கள்',
        nav_ngo_dir: 'அரசு சாரா நிறுவனங்கள்',
        nav_petitions: 'கிராம மனுக்கள்',
        nav_submit_evidence: 'ஆதாரங்களைச் சமர்ப்பிக்கவும்',

        // Dashboard Roles & Banners
        admin_dashboard_title: 'தள ஆளுகை மற்றும் அபாயக் கண்காணிப்பு',
        admin_dashboard_sub: 'நேரலை CSR பொறுப்புடைமை மற்றும் சரிபார்ப்பு மேற்பார்வை.',
        corp_dashboard_title: 'நிறுவன CSR நிதி கட்டுப்பாடு',
        corp_dashboard_sub: 'திட்ட மைல்கல் நிதியை நிர்வகித்து விடுவிக்கவும்.',
        ngo_dashboard_title: 'அரசு சாரா நிறுவன கூட்டாளர் பணி இடம்',
        ngo_dashboard_sub: 'புல ஆய்வு மற்றும் புவிக்குறியிடப்பட்ட ஆதாரச் சமர்ப்பிப்பு.',
        citizen_dashboard_title: 'சமூகக் குரல் & கிராம மையம்',
        citizen_dashboard_sub: 'கிராம மனுக்களைச் சமர்ப்பித்து சமூக தாக்கத்தை சரிபார்க்கவும்.',

        // Core Principle Banners
        status_locked_banner: 'நிதி நிலை: பூட்டப்பட்டது — சரிபார்க்கப்பட்ட முன்னேற்றத்திற்கு காத்திருக்கிறது',
        status_verified_banner: 'மைல்கல் சரிபார்க்கப்பட்டது — அடுத்த நிதி நிலை திறக்கப்பட்டது',
        status_blocked_banner: 'நிதி நிலை: தடுக்கப்பட்டது — இடம் பொருந்தாமை அல்லது மோசடி கண்டறியப்பட்டது',

        // Metrics
        metric_approved_budget: 'ஒப்புதலளிக்கப்பட்ட வரவுசெலவு',
        metric_released_amount: 'விடுவிக்கப்பட்ட தொகை',
        metric_locked_amount: 'பாதுகாக்கப்பட்ட தொகை',
        metric_current_stage: 'தற்போதைய நிலை',
        metric_verification_score: 'சரிபார்ப்பு மதிப்பெண்',
        metric_risk_level: 'அபாய நிலை',
        metric_physical_progress: 'உண்மையான முன்னேற்றம்',

        // Buttons
        btn_open_engine: 'சரிபார்ப்பு இயந்திரத்தைத் திறக்கவும்',
        btn_submit_evidence: 'மைல்கல் ஆதாரத்தைச் சமர்ப்பிக்கவும்',
        btn_release_funds: 'நிதியை விடுவிக்கவும்',
        btn_inspect: 'ஆய்வு செய்',
        btn_approve: 'ஒப்புதல் அளிக்கவும்',
        btn_reject: 'நிராகரி',
        btn_flag: 'தணிக்கைக்குக் கொடியிடு',
        btn_revision: 'திருத்தம் கோரவும்',
        btn_demo_gps: '🚨 GPS பொருந்தாமை செய்முறை',
        btn_demo_dup: '🔄 போலி புகைப்பட செய்முறை',
        btn_demo_valid: '✅ சரியான சரிபார்ப்பைச் சமர்ப்பிக்கவும்',
        btn_reset: 'மீட்டமைக்கவும்',
    },
    te: {
        // App Core (Telugu)
        platform_title: 'FINX CSR బాధ్యత రక్షణ',
        active_role: 'సక్రియ పాత్ర',
        select_language: 'భాషను ఎంచుకోండి',

        // Navigation
        nav_dashboard: 'డాష్‌బోర్డ్',
        nav_verified_milestones: 'ధృవీకరించబడిన మైలురాళ్ళు',
        nav_ngo_validation: 'ఎన్‌జీఓ ధృవీకరణ',
        nav_escrow: 'ఎస్క్రో నియంత్రణలు',
        nav_demo: 'ఆన్-చైన్ డెమో',
        nav_impact: 'ప్రభావ నివేదికలు',
        nav_csr_matches: 'CSR మ్యాచ్‌లు',
        nav_corporate_dir: 'కార్పొరేట్ భాగస్వాములు',
        nav_ngo_dir: 'ఎన్‌జీఓ నెట్‌వర్క్',
        nav_petitions: 'గ్రామ వినతులు',
        nav_submit_evidence: 'ఆధారాన్ని సమర్పించండి',

        // Dashboard Roles & Banners
        admin_dashboard_title: 'ప్లాట్‌ఫారమ్ పాలన & ప్రమాద పర్యవేక్షణ',
        admin_dashboard_sub: 'రియల్-టైమ్ CSR బాధ్యత మరియు ధృవీకరణ పర్యవేక్షణ.',
        corp_dashboard_title: 'కార్పొరేట్ CSR నిధుల నియంత్రణ',
        corp_dashboard_sub: 'ప్రాజెక్ట్ నిధులను నిర్వహించండి మరియు విడుదల చేయండి.',
        ngo_dashboard_title: 'ఎన్‌జీఓ భాగస్వామి మరియు క్షేత్ర పరిశీలన',
        ngo_dashboard_sub: 'క్షేత్ర పరిశీలన మరియు జియో-ట్యాగ్ చేయబడిన ఆధారాల సమర్పణ.',
        citizen_dashboard_title: 'సమాజ గొంతు & గ్రామ కేంద్రం',
        citizen_dashboard_sub: 'గ్రామ వినతులను సమర్పించండి మరియు పబ్లిక్ ప్రభావాన్ని తనిఖీ చేయండి.',

        // Core Principle Banners
        status_locked_banner: 'నిధుల స్థితి: లాక్ చేయబడింది — ధృవీకరించబడిన పురోగతి కోసం వేచి ఉంది',
        status_verified_banner: 'మైలురాయి ధృవీకరించబడింది — తదుపరి నిధుల దశ అన్‌లాక్ చేయబడింది',
        status_blocked_banner: 'నిధుల స్థితి: నిరోధించబడింది — స్థలం సరిపోలకపోవడం లేదా మోసం కనుగొనబడింది',

        // Metrics
        metric_approved_budget: 'ఆమోదించబడిన బడ్జెట్',
        metric_released_amount: 'విడుదల చేసిన మొత్తం',
        metric_locked_amount: 'లాక్ చేసిన మొత్తం',
        metric_current_stage: 'ప్రస్తుత దశ',
        metric_verification_score: 'ధృవీకరణ స్కోరు',
        metric_risk_level: 'ప్రమాద స్థాయి',
        metric_physical_progress: 'భౌతిక పురోగతి',

        // Buttons
        btn_open_engine: 'ధృవీకరణ ఇంజిన్‌ను తెరువు',
        btn_submit_evidence: 'మైలురాయి ఆధారాన్ని సమర్పించు',
        btn_release_funds: 'నిధులను విడుదల చేయి',
        btn_inspect: 'పరిశీలించు',
        btn_approve: 'ఆమోదించు',
        btn_reject: 'తిరస్కరించు',
        btn_flag: 'ఆడిట్ కోసం ఫ్లాగ్ చేయి',
        btn_revision: 'సవరణను అభ్యర్థించు',
        btn_demo_gps: '🚨 GPS అసమతుల్యత డెమో',
        btn_demo_dup: '🔄 నకిలీ ఫోటో డెమో',
        btn_demo_valid: '✅ సరైన ధృవీకరణను సమర్పించు',
        btn_reset: 'రీసెట్ చేయి',
    }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [lang, setLangState] = useState<Language>('en');

    useEffect(() => {
        const savedLang = localStorage.getItem('finx_lang') as Language;
        if (savedLang && translations[savedLang]) {
            setLangState(savedLang);
        }
    }, []);

    const setLang = (newLang: Language) => {
        setLangState(newLang);
        localStorage.setItem('finx_lang', newLang);
    };

    const t = (key: string): string => {
        const dict = translations[lang] || translations['en'];
        return dict[key] || translations['en'][key] || key;
    };

    return (
        <LanguageContext.Provider value={{ lang, setLang, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}
