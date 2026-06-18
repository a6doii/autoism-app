import React, { useEffect, useMemo, useRef, useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlus, faArrowLeft, faDownload, faFileMedical, faTrash, faPlay, faList, faChevronDown, faChevronUp
} from '@fortawesome/free-solid-svg-icons';
import { api } from '../lib/api';
import { useLanguage } from '../context/LanguageContext';
import '../CSS/Cases.css';
import mascotThinking from '../Assets/mascot_thinking.png';
import mascotHappyResult from '../Assets/mascot_happy_result.png';
import MascotSparkle from '../Components/MascotSparkle';

const answerLetters = ['A', 'B', 'C', 'D', 'E'];
const emptyForm = { child_name: '', child_dob: '', brief: '' };

const emptyQchat = {
  child_sex: '', child_ethnicity: '', jaundice: '', family_asd: '',
  A1: '', A2: '', A3: '', A4: '', A5: '', A6: '', A7: '', A8: '', A9: '', A10: ''
};

const Cases = () => {
  const { t, language } = useLanguage();
  const [view, setView] = useState('list');
  const [cases, setCases] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [activeCase, setActiveCase] = useState(null);
  const [reports, setReports] = useState([]);
  const [gameScores, setGameScores] = useState([]);
  const [currentReport, setCurrentReport] = useState(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const errorRef = useRef(null);
  useEffect(() => {
    if (error && errorRef.current) {
      errorRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [error]);
  const [qchat, setQchat] = useState(emptyQchat);

  const [assessmentStep, setAssessmentStep] = useState('image');
  const [faceImage, setFaceImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [imageChecked, setImageChecked] = useState(false);

  const [displayCount, setDisplayCount] = useState(6);

  const questionTexts = {
    1: t.q1, 2: t.q2, 3: t.q3, 4: t.q4, 5: t.q5,
    6: t.q6, 7: t.q7, 8: t.q8, 9: t.q9, 10: t.q10,
  };

  const options = {
    1: [t.always, t.usually, t.sometimes, t.rarely, t.never],
    2: [t.veryEasy, t.quiteEasy, t.quiteDifficult, t.veryDifficult, t.impossible],
    3: [t.manyTimesDay, t.fewTimesDay, t.fewTimesWeek, t.lessThanOnceWeek, t.never],
    4: [t.manyTimesDay, t.fewTimesDay, t.fewTimesWeek, t.lessThanOnceWeek, t.never],
    5: [t.manyTimesDay, t.fewTimesDay, t.fewTimesWeek, t.lessThanOnceWeek, t.never],
    6: [t.manyTimesDay, t.fewTimesDay, t.fewTimesWeek, t.lessThanOnceWeek, t.never],
    7: [t.always, t.usually, t.sometimes, t.rarely, t.never],
    8: [t.veryTypical, t.quiteTypical, t.slightlyUnusual, t.veryUnusual, t.doesntSpeak],
    9: [t.manyTimesDay, t.fewTimesDay, t.fewTimesWeek, t.lessThanOnceWeek, t.never],
    10: [t.manyTimesDay, t.fewTimesDay, t.fewTimesWeek, t.lessThanOnceWeek, t.never]
  };

  // eslint-disable-next-line no-unused-vars
  const translateReportToArabic = (englishText) => {
    if (!englishText) return '';
    let translated = englishText;

    const allMaps = {
      'Auto-Ism Final Report for': t.autoIsmFinalReportFor || 'التقرير النهائي من Auto-Ism لـ',
      'High risk': t.highRiskAr || 'خطر مرتفع',
      'Low risk': t.lowRiskAr || 'خطر منخفض',
      'Moderate risk': t.moderateRiskAr || 'خطر متوسط',
      'Risk Level': t.riskLevelAr || 'مستوى الخطر',
      'Q-CHAT Score': t.qchatScoreAr || 'درجة Q-CHAT',
      'Facial Analysis Score': t.facialAnalysisScoreAr || 'درجة تحليل الوجه',
      'Combined Risk Score': t.combinedRiskScoreAr || 'درجة المخاطر المجمعة',
      'Based on the analysis': t.basedOnAnalysisAr || 'بناءً على التحليل',
      'The results indicate': t.resultsIndicateAr || 'تشير النتائج إلى',
      'consult a specialist': t.consultSpecialistAr || 'استشارة أخصائي',
      'monitor development': t.monitorDevelopmentAr || 'مراقبة التطور',
      'early intervention': t.earlyInterventionAr || 'التدخل المبكر',
      'Please note': t.pleaseNoteAr || 'يرجى الملاحظة',
      'This is not a medical diagnosis': t.notMedicalDiagnosisAr || 'هذا ليس تشخيصاً طبياً',
      'For further evaluation': t.forFurtherEvaluationAr || 'للتقييم الإضافي',
      'Question responses': t.questionResponses || 'إجابات الأسئلة',
      'Weighting used': t.weightingUsed || 'الأوزان المستخدمة',
      'Q-CHAT weight': t.qchatWeight || 'وزن Q-CHAT',
      'Facial image weight': t.facialWeight || 'وزن الصورة',
      'No autism likelihood detected': t.noAutismLikelihoodDetected || 'لم يتم اكتشاف احتمالية التوحد',
      'Low autism likelihood': t.lowAutismLikelihood || 'احتمالية توحد منخفضة',
      'Autism likelihood detected': t.autismLikelihoodDetected || 'تم اكتشاف احتمالية التوحد',
      'Final assessment:': 'التقييم النهائي:',
      'Case ID': t.caseId || 'رقم الحالة',
      'Report ID': t.reportId || 'رقم التقرير',
      'Date': t.date || 'التاريخ',
      'Assessment Results': t.assessmentResults || 'نتائج التقييم',
      'Detailed Analysis': t.detailedAnalysis || 'تحليل مفصل',
      'Generated by': t.generatedBy || 'تم الإنشاء بواسطة',
      'Q-CHAT risk': t.qchatRisk || 'خطر Q-CHAT',
      'Facial image risk': t.facialImageRisk || 'خطر صورة الوجه',
      'Facial risk': t.facialRisk || 'خطر الوجه',
      'Final weighted risk': t.finalWeightedRisk || 'الخطر النهائي المرجح',
      'Final risk': t.finalRisk || 'الخطر النهائي',

      'Child sex: female': `${t.childSex || 'جنس الطفل'}: ${t.female || 'أنثى'}`,
      'Child sex: male': `${t.childSex || 'جنس الطفل'}: ${t.male || 'ذكر'}`,
      'Ethnicity: white-european': `${t.ethnicity || 'العرق'}: ${t.whiteEuropean || 'أبيض-أوروبي'}`,
      'Ethnicity: asian': `${t.ethnicity || 'العرق'}: ${t.asian || 'آسيوي'}`,
      'Ethnicity: middle eastern': `${t.ethnicity || 'العرق'}: ${t.middleEastern || 'شرق أوسطي'}`,
      'Ethnicity: black': `${t.ethnicity || 'العرق'}: ${t.black || 'أسود'}`,
      'Ethnicity: south asian': `${t.ethnicity || 'العرق'}: ${t.southAsian || 'جنوب آسيوي'}`,
      'Ethnicity: hispanic': `${t.ethnicity || 'العرق'}: ${t.hispanic || 'من أصل إسباني'}`,
      'Ethnicity: latino': `${t.ethnicity || 'العرق'}: ${t.latino || 'لاتيني'}`,
      'Ethnicity: others': `${t.ethnicity || 'العرق'}: ${t.others || 'أخرى'}`,
      'Ethnicity: mixed': `${t.ethnicity || 'العرق'}: ${t.mixed || 'مختلط'}`,
      'Ethnicity: pacifica': `${t.ethnicity || 'العرق'}: ${t.pacifica || 'جزر المحيط الهادئ'}`,
      'Ethnicity: native indian': `${t.ethnicity || 'العرق'}: ${t.nativeIndian || 'هندي أصلي'}`,
      'Jaundice history: no': `${t.jaundiceHistory || 'تاريخ اليرقان'}: ${t.no || 'لا'}`,
      'Jaundice history: yes': `${t.jaundiceHistory || 'تاريخ اليرقان'}: ${t.yes || 'نعم'}`,
      'Family ASD history: no': `${t.familyASDHistory || 'تاريخ العائلة مع التوحد'}: ${t.no || 'لا'}`,
      'Family ASD history: yes': `${t.familyASDHistory || 'تاريخ العائلة مع التوحد'}: ${t.yes || 'نعم'}`,
      'Note: This report is a screening aid and does not replace a clinical diagnosis.': 'ملاحظة: هذا التقرير هو أداة فحص مساعدة ولا يحل محل التشخيص السريري.',

      'Does your child look at you when you call his/her name?': t.q1,
      'How easy is it for you to get eye contact with your child?': t.q2,
      'Does your child point to indicate that s/he wants something?': t.q3,
      'Does your child point to indicate that s/he wants something? (e.g., a toy that is out of reach)': t.q3,
      'Does your child point to share interest with you?': t.q4,
      'Does your child point to share interest with you? (e.g., pointing at an interesting sight)': t.q4,
      'Does your child pretend?': t.q5,
      'Does your child pretend? (e.g., care for dolls, talk on a toy phone)': t.q5,
      'Does your child follow where you’re looking?': t.q6,
      'If you or someone else is upset, does your child seem to notice or care?': t.q7,
      'If someone is upset, does your child try to comfort them?': t.q7,
      'Would you describe your child’s first words as:': t.q8,
      'Does your child make unusual finger movements near his/her eyes?': t.q9,
      'Does your child use simple gestures?': t.q9,
      'Does your child become fascinated by moving objects? (e.g., wheels, spinning objects)': t.q10,
      'Does your child stare at nothing with no apparent purpose?': t.q10,

      'Always': t.always,
      'Usually': t.usually,
      'Sometimes': t.sometimes,
      'Rarely': t.rarely,
      'Never': t.never,
      'Very easy': t.veryEasy,
      'Quite easy': t.quiteEasy,
      'Quite difficult': t.quiteDifficult,
      'Very difficult': t.veryDifficult,
      'Impossible': t.impossible,
      'Many times a day': t.manyTimesDay,
      'Few times a day': t.fewTimesDay,
      'Few times a week': t.fewTimesWeek,
      'Less than once a week': t.lessThanOnceWeek,
      'Very typical': t.veryTypical,
      'Quite typical': t.quiteTypical,
      'Slightly unusual': t.slightlyUnusual,
      'Very unusual': t.veryUnusual,
      "Doesn't speak": t.doesntSpeak
    };

    const sortedKeys = Object.keys(allMaps).sort((a, b) => b.length - a.length);

    for (const eng of sortedKeys) {
      if (allMaps[eng]) {
        const isSingleWord = !eng.includes(' ');
        const regexStr = isSingleWord 
          ? `\\b${eng.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b` 
          : eng.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        
        const regex = new RegExp(regexStr, 'gi');
        translated = translated.replace(regex, allMaps[eng]);
      }
    }

    return translated;
  };

  const getArabicRiskLabel = (englishLabel) => {
    if (!englishLabel) return englishLabel;
    const label = englishLabel.toLowerCase();
    if (label.includes('high risk')) return t.highRiskAr || 'خطر مرتفع';
    if (label.includes('low risk')) return t.lowRiskAr || 'خطر منخفض';
    if (label.includes('moderate risk')) return t.moderateRiskAr || 'خطر متوسط';
    if (label.includes('no autism likelihood detected')) return t.noAutismLikelihoodDetected || 'لم يتم اكتشاف احتمالية التوحد';
    if (label.includes('low autism likelihood')) return t.lowAutismLikelihood || 'احتمالية توحد منخفضة';
    if (label.includes('autism likelihood detected')) return t.autismLikelihoodDetected || 'تم اكتشاف احتمالية التوحد';
    if (label.includes('final risk')) return t.finalRiskAr || 'الخطر النهائي';
    return englishLabel;
  };

  const getTranslatedCaseResult = (resultSummary) => {
    if (language !== 'ar') return resultSummary;
    if (!resultSummary) return t.noReportYet || '';

    let translated = String(resultSummary);
    
    const phrases = {
      'no autism likelihood detected': t.noAutismLikelihoodDetected || 'لم يتم اكتشاف احتمالية التوحد',
      'low autism likelihood': t.lowAutismLikelihood || 'احتمالية توحد منخفضة',
      'autism likelihood detected': t.autismLikelihoodDetected || 'تم اكتشاف احتمالية التوحد',
      'high risk': t.highRiskAr || 'خطر مرتفع',
      'low risk': t.lowRiskAr || 'خطر منخفض',
      'moderate risk': t.moderateRiskAr || 'خطر متوسط',
      'q-chat risk': t.qchatRisk || 'خطر Q-CHAT',
      'facial image risk': t.facialImageRisk || 'خطر صورة الوجه',
      'facial risk': t.facialRisk || 'خطر الوجه',
      'final weighted risk': t.finalWeightedRisk || 'الخطر النهائي المرجح',
      'final risk': t.finalRisk || 'الخطر النهائي'
    };

    const sortedPhrases = Object.keys(phrases).sort((a, b) => b.length - a.length);
    
    sortedPhrases.forEach(eng => {
      const regex = new RegExp(eng, 'gi');
      translated = translated.replace(regex, phrases[eng]);
    });

    return translated;
  };

  async function loadCases() {
    const data = await api('/cases');
    setCases(data.cases || []);
  }

  useEffect(() => { loadCases(); }, []);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  function setAnswer(name, value) {
    setQchat((prev) => ({ ...prev, [name]: value }));
  }

  function handleImageChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFaceImage(file);
    setImageChecked(false);
    setError('');
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview(URL.createObjectURL(file));
  }

  async function validateFaceAndContinue() {
    try {
      setError('');
      if (!faceImage) {
        setError(t.pleaseUploadImage);
        return;
      }
      const formData = new FormData();
      formData.append('image', faceImage);
      formData.append('case_id', activeCase.id);
      const data = await api('/validate-face-image', {
        method: 'POST',
        body: formData,
        isFormData: true
      });
      if (!data.valid) {
        setError(data.error || t.clearFrontFaceImage);
        return;
      }
      setImageChecked(true);
      setAssessmentStep('questions');
    } catch (err) {
      setError(err.message || t.imageValidationFailed);
    }
  }

  async function createCase() {
    try {
      const data = await api('/cases', {
        method: 'POST',
        body: JSON.stringify(form)
      });
      setCases([data.case, ...cases]);
      setForm(emptyForm);
      setMessage(t.caseCreated);
      setError('');
      setView('list');
    } catch (err) {
      setError(err.message);
    }
  }

  async function deleteCase(id) {
    if (!window.confirm(t.deleteCaseConfirm)) return;
    await api(`/cases/${id}`, { method: 'DELETE' });
    setCases(cases.filter((c) => c.id !== id));
  }

  async function openReports(caseItem) {
    setActiveCase(caseItem);
    const data = await api(`/cases/${caseItem.id}/reports`);
    setReports(data.reports || []);
    try {
      const gameData = await api(`/cases/${caseItem.id}/game-scores`);
      setGameScores(gameData.game_scores || []);
    } catch {
      setGameScores([]);
    }
    setView('reports');
  }

  const GAME_LABELS = {
    recognition: t.gameIntroTitle,
    shapes: t.shapeGameTitle,
    emotions: t.emotionGameTitle,
  };

  async function submitTest() {
    try {
      setError('');
      if (!faceImage) {
        setError(t.pleaseUploadImage);
        return;
      }
      for (let i = 1; i <= 10; i++) {
        if (!qchat[`A${i}`]) {
          setError(t.pleaseAnswerQuestion.replace('{i}', i));
          return;
        }
      }
      if (!qchat.child_sex || !qchat.child_ethnicity || !qchat.jaundice || !qchat.family_asd) {
        setError(t.fillAllInputs);
        return;
      }
      const formData = new FormData();
      Object.entries(qchat).forEach(([key, value]) => formData.append(key, value));
      formData.append('image', faceImage);
      const data = await api(`/cases/${activeCase.id}/test`, {
        method: 'POST',
        body: formData,
        isFormData: true
      });
      
      setCurrentReport(data.result);
      await loadCases();
      setView('report');
    } catch (err) {
      setError(err.message);
    }
  }

  const riskPercent = useMemo(() => {
    return currentReport?.combined_risk != null
      ? `${(currentReport.combined_risk * 100).toFixed(1)}%`
      : t.notApplicable || 'N/A';
  }, [currentReport, t]);

  const getRecommendation = (report, lang) => {
    const isHigh = report?.prediction_label?.toLowerCase().includes('high') ||
                   report?.prediction_label?.toLowerCase().includes('autism likelihood detected');
    if (lang === 'ar') {
      return isHigh
        ? 'تم رصد خطر مرتفع للتوحد. قم بزيارة أقرب أخصائي توحد حتى يتمكن من مساعدتك بشكل أكثر شمولاً. تذكر (الكشف المبكر عن التوحد هو نصف الرحلة للتغلب على التوحد). ملاحظة: هذا التقرير لا يحل محل التشخيص السريري.'
        : 'لم يتم رصد أي علامات للتوحد. إذا كان لديك أي مخاوف، يرجى زيارة أقرب أخصائي توحد وإراءته هذا التقرير. ملاحظة: هذا التقرير لا يحل محل التشخيص السريري.';
    }
    return isHigh
      ? 'A high risk of autism has been observed. Visit the nearest autism specialist so they can help you more extensively. Remember (detecting autism early is half the journey to overcome autism). Note: This report does not replace a clinical diagnosis.'
      : 'No signs of autism were observed. If you have any concerns, please visit your nearest autism specialist and show them this report. Note: This report does not replace a clinical diagnosis.';
  };

  const generatePDF = () => {
    if (!currentReport) return;

    const isHighRisk = currentReport.prediction_label?.toLowerCase().includes('high') ||
                       currentReport.prediction_label?.toLowerCase().includes('autism likelihood detected');
    const accentColor = isHighRisk ? [220, 38, 38] : [5, 150, 105];
    const riskLabel = isHighRisk ? 'HIGH RISK' : 'LOW RISK';
    const childName = activeCase?.child_name || 'N/A';
    const childDob = activeCase?.child_dob || 'N/A';
    const reportDate = new Date(currentReport.created_at).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
    const riskPct = currentReport.combined_risk != null
      ? `${(currentReport.combined_risk * 100).toFixed(1)}%`
      : 'N/A';

    const extractDemo = (text, key) => {
      if (!text) return null;
      const regex = new RegExp(`${key}:\\s*([^\\n\\r]+)`, 'i');
      const match = text.match(regex);
      return match ? match[1].trim() : null;
    };
    const demSex = extractDemo(currentReport.report_text, 'Child sex') || qchat.child_sex || 'N/A';
    const demEthnicity = extractDemo(currentReport.report_text, 'Ethnicity') || qchat.child_ethnicity || 'N/A';
    const demJaundice = extractDemo(currentReport.report_text, 'Jaundice history') || qchat.jaundice || 'N/A';
    const demFamilyAsd = extractDemo(currentReport.report_text, 'Family ASD history') || qchat.family_asd || 'N/A';

    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

    // ── Page 1 ──────────────────────────────────────────
    doc.setFontSize(28); doc.setFont('helvetica', 'bold'); doc.setTextColor(15, 23, 42);
    doc.text('Auto-Ism', 20, 25);
    doc.setFontSize(11); doc.setFont('helvetica', 'normal'); doc.setTextColor(100, 116, 139);
    doc.text('Early Autism Screening Report', 20, 33);
    doc.setFontSize(9); doc.setTextColor(148, 163, 184);
    doc.text('Cairo University FCAI 2026', 190, 20, { align: 'right' });
    doc.text('Supervised by Dr. Elham Shawky', 190, 26, { align: 'right' });

    doc.setDrawColor(...accentColor); doc.setLineWidth(0.8);
    doc.line(20, 38, 190, 38);

    doc.setFillColor(248, 250, 252); doc.setDrawColor(203, 213, 225); doc.setLineWidth(0.3);
    doc.roundedRect(20, 44, 170, 32, 2, 2, 'FD');

    doc.setFontSize(8); doc.setFont('helvetica', 'bold'); doc.setTextColor(100, 116, 139);
    doc.text('PATIENT NAME', 28, 52);
    doc.text('DATE OF ASSESSMENT', 115, 52);
    doc.setFontSize(12); doc.setFont('helvetica', 'bold'); doc.setTextColor(15, 23, 42);
    doc.text(childName, 28, 59);
    doc.text(reportDate, 115, 59);

    doc.setFontSize(8); doc.setFont('helvetica', 'bold'); doc.setTextColor(100, 116, 139);
    doc.text('DATE OF BIRTH', 28, 67);
    doc.text('CASE REFERENCE', 115, 67);
    doc.setFontSize(12); doc.setFont('helvetica', 'bold'); doc.setTextColor(15, 23, 42);
    doc.text(childDob, 28, 74);
    doc.text(`#${currentReport.case_id}`, 115, 74);

    doc.setFillColor(...accentColor);
    doc.roundedRect(20, 84, 170, 22, 3, 3, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9); doc.setFont('helvetica', 'normal');
    doc.text('COMBINED RISK INDICATION', 105, 92, { align: 'center' });
    doc.setFontSize(18); doc.setFont('helvetica', 'bold');
    doc.text(riskLabel, 105, 101, { align: 'center' });

    doc.setTextColor(15, 23, 42); doc.setFontSize(13); doc.setFont('helvetica', 'bold');
    doc.text('Model Diagnostics', 20, 118);
    doc.setDrawColor(226, 232, 240); doc.setLineWidth(0.5);
    doc.line(20, 121, 190, 121);

    autoTable(doc, {
      startY: 124,
      head: [['Assessment Component', 'Score']],
      body: [
        ['Q-CHAT-10 Questionnaire Analysis', `${currentReport.spark_score}/10`],
        ['Facial Biometric Analysis', currentReport.image_score != null ? `${(currentReport.image_score * 100).toFixed(1)}%` : 'N/A'],
        ['Final Weighted Probability', riskPct],
      ],
      headStyles: { fillColor: [241, 245, 249], textColor: [71, 85, 105], fontStyle: 'bold', fontSize: 10, lineColor: [203, 213, 225], lineWidth: 0.3 },
      bodyStyles: { textColor: [51, 65, 85], fontSize: 11, lineColor: [226, 232, 240], lineWidth: 0.2 },
      alternateRowStyles: { fillColor: [248, 250, 252] },
      columnStyles: { 0: { cellWidth: 135 }, 1: { cellWidth: 35, fontStyle: 'bold', halign: 'center' } },
      didParseCell: (data) => {
        if (data.row.index === 2 && data.section === 'body') {
          data.cell.styles.textColor = accentColor;
          data.cell.styles.fillColor = isHighRisk ? [254, 242, 242] : [236, 253, 245];
        }
      }
    });

    doc.setDrawColor(203, 213, 225); doc.setLineWidth(0.3);
    doc.line(20, 270, 190, 270);
    doc.setFontSize(8); doc.setFont('helvetica', 'normal'); doc.setTextColor(148, 163, 184);
    doc.text('This report is generated by an AI-based screening tool and does NOT constitute a medical diagnosis.', 20, 275);
    doc.text('Results must be interpreted by a qualified healthcare professional. Consult a pediatrician for formal evaluation.', 20, 280);

    // ── Page 2 ──────────────────────────────────────────
    doc.addPage();
    doc.setFontSize(28); doc.setFont('helvetica', 'bold'); doc.setTextColor(15, 23, 42);
    doc.text('Auto-Ism', 20, 25);
    doc.setFontSize(11); doc.setFont('helvetica', 'normal'); doc.setTextColor(100, 116, 139);
    doc.text('Detailed Analysis & Demographics', 20, 33);
    doc.setDrawColor(...accentColor); doc.setLineWidth(0.8);
    doc.line(20, 38, 190, 38);

    doc.setFontSize(13); doc.setFont('helvetica', 'bold'); doc.setTextColor(15, 23, 42);
    doc.text('Demographic Profile', 20, 50);
    doc.setDrawColor(226, 232, 240); doc.setLineWidth(0.5);
    doc.line(20, 53, 190, 53);

    autoTable(doc, {
      startY: 56,
      body: [
        ['Biological Sex', String(demSex).charAt(0).toUpperCase() + String(demSex).slice(1)],
        ['Ethnicity', String(demEthnicity).charAt(0).toUpperCase() + String(demEthnicity).slice(1)],
        ['History of Jaundice', String(demJaundice).charAt(0).toUpperCase() + String(demJaundice).slice(1)],
        ['Family ASD History', String(demFamilyAsd).charAt(0).toUpperCase() + String(demFamilyAsd).slice(1)],
      ],
      bodyStyles: { textColor: [51, 65, 85], fontSize: 11, lineColor: [226, 232, 240], lineWidth: 0.2 },
      alternateRowStyles: { fillColor: [248, 250, 252] },
      columnStyles: { 0: { cellWidth: 80, fontStyle: 'bold', textColor: [100, 116, 139] }, 1: { cellWidth: 90 } },
    });

    const afterTableY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(13); doc.setFont('helvetica', 'bold'); doc.setTextColor(15, 23, 42);
    doc.text('Clinical Recommendation', 20, afterTableY);
    doc.setDrawColor(226, 232, 240); doc.setLineWidth(0.5);
    doc.line(20, afterTableY + 3, 190, afterTableY + 3);

    doc.setDrawColor(...accentColor); doc.setLineWidth(1.2);
    const textStartY = afterTableY + 10;
    doc.line(20, textStartY, 20, textStartY + 80);

    const reportText = getRecommendation(currentReport, 'en');
    const textLines = doc.splitTextToSize(reportText, 160);
    doc.setFontSize(10); doc.setFont('helvetica', 'normal'); doc.setTextColor(51, 65, 85);
    doc.text(textLines, 25, textStartY + 6);

    doc.setDrawColor(203, 213, 225); doc.setLineWidth(0.3);
    doc.line(20, 270, 190, 270);
    doc.setFontSize(9); doc.setFont('helvetica', 'bold'); doc.setTextColor(148, 163, 184);
    doc.text(`Generated: ${reportDate}`, 105, 276, { align: 'center' });

    // ── Page 3: Q-CHAT Responses ────────────────────────
    doc.addPage();
    doc.setFontSize(28); doc.setFont('helvetica', 'bold'); doc.setTextColor(15, 23, 42);
    doc.text('Auto-Ism', 20, 25);
    doc.setFontSize(11); doc.setFont('helvetica', 'normal'); doc.setTextColor(100, 116, 139);
    doc.text('Q-CHAT-10 Questionnaire Responses', 20, 33);
    doc.setDrawColor(...accentColor); doc.setLineWidth(0.8);
    doc.line(20, 38, 190, 38);

    doc.setFontSize(13); doc.setFont('helvetica', 'bold'); doc.setTextColor(15, 23, 42);
    doc.text('Question Responses', 20, 50);
    doc.setDrawColor(226, 232, 240); doc.setLineWidth(0.5);
    doc.line(20, 53, 190, 53);

    const pdfQuestions = [
      'Does your child look at you when you call his/her name?',
      'How easy is it for you to get eye contact with your child?',
      'Does your child point to indicate that s/he wants something?',
      'Does your child point to share interest with you?',
      'Does your child pretend? (e.g., care for dolls, talk on toy phone)',
      'Does your child follow where you\'re looking?',
      'If someone is upset, does your child try to comfort them?',
      'Would you describe your child\'s first words as:',
      'Does your child use simple gestures?',
      'Does your child stare at nothing with no apparent purpose?',
    ];
    const pdfOptions = [
      ['Always','Usually','Sometimes','Rarely','Never'],
      ['Very easy','Quite easy','Quite difficult','Very difficult','Impossible'],
      ['Many times a day','Few times a day','Few times a week','Less than once a week','Never'],
      ['Many times a day','Few times a day','Few times a week','Less than once a week','Never'],
      ['Many times a day','Few times a day','Few times a week','Less than once a week','Never'],
      ['Many times a day','Few times a day','Few times a week','Less than once a week','Never'],
      ['Always','Usually','Sometimes','Rarely','Never'],
      ['Very typical','Quite typical','Slightly unusual','Very unusual',"Doesn't speak"],
      ['Many times a day','Few times a day','Few times a week','Less than once a week','Never'],
      ['Many times a day','Few times a day','Few times a week','Less than once a week','Never'],
    ];
    const reportAnswers = currentReport.answers || {};
    const qchatRows = pdfQuestions.map((q, i) => {
      const letter = reportAnswers[`A${i + 1}`] || '-';
      const idx = ['A','B','C','D','E'].indexOf(letter);
      const answerText = idx >= 0 ? pdfOptions[i][idx] : letter;
      return [`Q${i + 1}`, q, answerText];
    });
    autoTable(doc, {
      startY: 56,
      head: [['#', 'Question', 'Response']],
      body: qchatRows,
      headStyles: { fillColor: [241, 245, 249], textColor: [71, 85, 105], fontStyle: 'bold', fontSize: 9, lineColor: [203, 213, 225], lineWidth: 0.3 },
      bodyStyles: { textColor: [51, 65, 85], fontSize: 9, lineColor: [226, 232, 240], lineWidth: 0.2 },
      alternateRowStyles: { fillColor: [248, 250, 252] },
      columnStyles: { 0: { cellWidth: 12, halign: 'center', fontStyle: 'bold' }, 1: { cellWidth: 128 }, 2: { cellWidth: 40, fontStyle: 'bold' } },
    });

    doc.setDrawColor(203, 213, 225); doc.setLineWidth(0.3);
    doc.line(20, 270, 190, 270);
    doc.setFontSize(9); doc.setFont('helvetica', 'bold'); doc.setTextColor(148, 163, 184);
    doc.text(`Generated: ${reportDate}`, 105, 276, { align: 'center' });

    const fileName = `Auto-Ism-Report-${childName.replace(/[^a-zA-Z0-9]/g, '-')}.pdf`;
    doc.save(fileName);
  };

  const generateArabicReport = async () => {
    if (!currentReport) return;

    const isHighRisk = currentReport.prediction_label?.toLowerCase().includes('high') ||
                       currentReport.prediction_label?.toLowerCase().includes('autism likelihood detected');
    const themeHex = isHighRisk ? '#dc2626' : '#059669';
    const themeBg  = isHighRisk ? '#fef2f2' : '#ecfdf5';
    const childName = activeCase?.child_name || 'N/A';
    const riskPct  = currentReport.combined_risk != null
      ? `${(currentReport.combined_risk * 100).toFixed(1)}%` : 'N/A';
    const dateStr  = currentReport.created_at
      ? new Date(currentReport.created_at).toLocaleDateString('ar-EG', { year:'numeric', month:'long', day:'numeric' })
      : '';

    const transVal = v => ({
      male:'ذكر', female:'أنثى', yes:'نعم', no:'لا',
      'white-european':'أوروبي أبيض', asian:'آسيوي', 'middle eastern':'شرق أوسطي',
      black:'أسود', 'south asian':'جنوب آسيوي', hispanic:'لاتيني',
      others:'أخرى', mixed:'مختلط',
    })[(v||'').toLowerCase().trim()] || (v||'N/A');

    const exd = key => {
      if (!currentReport.report_text) return 'N/A';
      const m = currentReport.report_text.match(new RegExp(`${key}:\\s*([^\\n\\r]+)`, 'i'));
      return m ? m[1].trim() : 'N/A';
    };

    const arQs = [
      'هل ينظر طفلك إليك عندما تناديه باسمه؟',
      'ما مدى سهولة التواصل البصري مع طفلك؟',
      'هل يشير طفلك للدلالة على أنه يريد شيئًا؟',
      'هل يشير طفلك لمشاركة اهتمامه معك؟',
      'هل يتظاهر طفلك (ألعاب التخيل)؟',
      'هل يتابع طفلك اتجاه نظرتك؟',
      'هل يحاول طفلك مواساة من يشعر بضيق؟',
      'كيف تصف كلمات طفلك الأولى؟',
      'هل يستخدم طفلك إيماءات بسيطة؟',
      'هل يحدق طفلك في الفراغ بلا هدف واضح؟',
    ];
    const arOs = [
      ['دائمًا','عادةً','أحيانًا','نادرًا','أبدًا'],
      ['سهل جدًا','سهل نسبيًا','صعب نسبيًا','صعب جدًا','مستحيل'],
      ['مرات عديدة يوميًا','بضع مرات يوميًا','بضع مرات أسبوعيًا','أقل من مرة أسبوعيًا','أبدًا'],
      ['مرات عديدة يوميًا','بضع مرات يوميًا','بضع مرات أسبوعيًا','أقل من مرة أسبوعيًا','أبدًا'],
      ['مرات عديدة يوميًا','بضع مرات يوميًا','بضع مرات أسبوعيًا','أقل من مرة أسبوعيًا','أبدًا'],
      ['مرات عديدة يوميًا','بضع مرات يوميًا','بضع مرات أسبوعيًا','أقل من مرة أسبوعيًا','أبدًا'],
      ['دائمًا','عادةً','أحيانًا','نادرًا','أبدًا'],
      ['طبيعية جدًا','طبيعية نسبيًا','غير عادية قليلًا','غير عادية جدًا','لا يتكلم'],
      ['مرات عديدة يوميًا','بضع مرات يوميًا','بضع مرات أسبوعيًا','أقل من مرة أسبوعيًا','أبدًا'],
      ['مرات عديدة يوميًا','بضع مرات يوميًا','بضع مرات أسبوعيًا','أقل من مرة أسبوعيًا','أبدًا'],
    ];

    // Ensure Cairo font is loaded in the browser (needed for canvas.fillText Arabic shaping)
    if (!document.querySelector('link[href*="Cairo"]')) {
      const lnk = document.createElement('link');
      lnk.rel = 'stylesheet';
      lnk.href = 'https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&display=swap';
      document.head.appendChild(lnk);
    }
    await document.fonts.ready;
    await Promise.all([
      document.fonts.load('400 16px Cairo'),
      document.fonts.load('700 16px Cairo'),
      document.fonts.load('800 16px Cairo'),
    ]);
    await new Promise(r => setTimeout(r, 200));

    // Canvas = 72 DPI (pt) at 2× scale, matching A4 exactly
    const W = 595, H = 842, M = 40, CW = W - 2 * M, S = 2;

    const mkPage = () => {
      const cv = document.createElement('canvas');
      cv.width = W * S; cv.height = H * S;
      const cx = cv.getContext('2d');
      cx.scale(S, S);
      cx.fillStyle = '#fff'; cx.fillRect(0, 0, W, H);
      return { cv, cx };
    };

    // Draw Arabic text (right-anchored by default)
    const T = (cx, text, x, y, size, wt = '400', color = '#334155', align = 'right') => {
      cx.save();
      cx.font = `${wt} ${size}px Cairo`;
      cx.textAlign = align; cx.textBaseline = 'middle'; cx.fillStyle = color;
      cx.fillText(String(text || ''), x, y);
      cx.restore();
    };

    const BOX = (cx, x, y, w, h, fill, stroke) => {
      if (fill)   { cx.fillStyle   = fill;   cx.fillRect(x, y, w, h); }
      if (stroke) { cx.strokeStyle = stroke; cx.lineWidth = 0.8; cx.strokeRect(x, y, w, h); }
    };

    const HR = (cx, y, color = '#e2e8f0') => {
      cx.save(); cx.strokeStyle = color; cx.lineWidth = 1;
      cx.beginPath(); cx.moveTo(M, y); cx.lineTo(W - M, y); cx.stroke(); cx.restore();
    };

    const HDR = (cx, sub) => {
      BOX(cx, 0, 0, W, 68, '#0f172a');
      T(cx, 'Auto-Ism', W - M, 26, 24, '800', 'white');
      T(cx, sub, W - M, 50, 11, '400', '#94a3b8');
    };

    // Word-wrap Arabic into lines, right-aligned
    const wrapAr = (cx, text, maxW, size, wt = '400') => {
      cx.font = `${wt} ${size}px Cairo`;
      const words = text.split(' ');
      const lines = [''];
      words.forEach(w => {
        const test = lines[lines.length - 1] + w + ' ';
        if (cx.measureText(test).width > maxW) lines.push(w + ' ');
        else lines[lines.length - 1] = test;
      });
      return lines.map(l => l.trim());
    };

    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

    // ── PAGE 1: overview ───────────────────────────────────────────────────────
    {
      const { cv, cx } = mkPage();
      HDR(cx, 'تقرير الفحص المبكر للتوحد');

      // Patient card
      BOX(cx, M, 80, CW, 82, '#f8fafc', '#cbd5e1');
      const fields = [
        ['اسم المريض',   childName],
        ['تاريخ التقييم', dateStr],
        ['تاريخ الميلاد', activeCase?.child_dob || 'N/A'],
        ['رقم الحالة',   `#${currentReport.case_id}`],
      ];
      fields.forEach(([lbl, val], i) => {
        const col = i % 2, row = Math.floor(i / 2);
        const px = col === 0 ? W - M - CW / 4 : W - M - CW * 3 / 4;
        T(cx, lbl,  px, 93  + row * 36, 8,  '600', '#64748b', 'center');
        T(cx, val,  px, 111 + row * 36, 12, '700', '#0f172a', 'center');
      });

      // Risk banner
      const by = 174;
      const gr = cx.createLinearGradient(M, by, M + CW, by);
      gr.addColorStop(0, isHighRisk ? '#dc2626' : '#059669');
      gr.addColorStop(1, isHighRisk ? '#7f1d1d' : '#064e3b');
      cx.fillStyle = gr; cx.fillRect(M, by, CW, 52);
      T(cx, 'مؤشر المخاطر المجمعة', W / 2, by + 16, 10, '400', 'rgba(255,255,255,0.85)', 'center');
      T(cx, isHighRisk ? 'خطر مرتفع' : 'خطر منخفض', W / 2, by + 37, 21, '800', 'white', 'center');

      // Diagnostics table
      const TY = 242;
      T(cx, 'تشخيصات النموذج', W - M, TY, 13, '700', '#0f172a');
      HR(cx, TY + 11, '#e2e8f0');
      const drows = [
        [`${currentReport.spark_score || 0}/10`, 'تحليل استبيان Q-CHAT-10'],
        [currentReport.image_score != null ? `${(currentReport.image_score * 100).toFixed(1)}%` : 'N/A', 'التحليل البيومتري للوجه'],
        [riskPct, 'الاحتمالية النهائية المرجحة'],
      ];
      const th2 = TY + 20;
      BOX(cx, M, th2, CW, 22, '#f1f5f9', '#cbd5e1');
      T(cx, 'الدرجة المحسوبة', W - M - CW / 4, th2 + 11, 9, '700', '#475569', 'center');
      T(cx, 'مكون التقييم',    W - M - CW*3/4,  th2 + 11, 9, '700', '#475569', 'center');
      drows.forEach(([val, lbl], i) => {
        const ry = th2 + 22 + i * 26;
        const last = i === 2;
        BOX(cx, M, ry, CW, 26, last ? themeBg : i % 2 === 0 ? '#fff' : '#f8fafc', '#e2e8f0');
        T(cx, val, W - M - CW / 4, ry + 13, last ? 12 : 10, last ? '800' : '400', last ? themeHex : '#334155', 'center');
        T(cx, lbl, W - M - CW*3/4, ry + 13, last ? 12 : 10, last ? '800' : '400', last ? themeHex : '#334155', 'center');
      });

      // Footer disclaimer
      HR(cx, H - 68, '#cbd5e1');
      const disc = 'هذا التقرير هو أداة مساعدة قائمة على الذكاء الاصطناعي ولا يشكل تشخيصاً طبياً رسمياً. يجب عرض هذه النتائج على طبيب أطفال أو أخصائي توحد معتمد.';
      const dLines = wrapAr(cx, disc, CW, 8);
      dLines.forEach((l, i) => T(cx, l, W - M, H - 62 + i * 13, 8, '400', '#94a3b8'));
      T(cx, 'تاريخ الإنشاء: ' + dateStr, W / 2, H - 26, 8, '600', '#64748b', 'center');

      doc.addImage(cv.toDataURL('image/jpeg', 0.95), 'JPEG', 0, 0, 210, 297);
    }

    // ── PAGE 2: demographics + recommendation ──────────────────────────────────
    {
      const { cv, cx } = mkPage();
      doc.addPage();
      HDR(cx, 'التحليل المفصل والبيانات الديموغرافية');

      const dy = 82;
      T(cx, 'الملف الديموغرافي', W - M, dy, 13, '700', '#0f172a');
      HR(cx, dy + 11, '#e2e8f0');
      const dem = [
        ['الجنس البيولوجي',         transVal(exd('Child sex'))],
        ['العرق',                   transVal(exd('Ethnicity'))],
        ['تاريخ الإصابة باليرقان',  transVal(exd('Jaundice history'))],
        ['تاريخ العائلة مع التوحد', transVal(exd('Family ASD history'))],
      ];
      dem.forEach(([lbl, val], i) => {
        const ry = dy + 20 + i * 28;
        BOX(cx, M, ry, CW, 28, i % 2 === 0 ? '#f8fafc' : '#fff', '#e2e8f0');
        T(cx, val, W - M - CW / 4, ry + 14, 12, '400', '#334155', 'center');
        T(cx, lbl, W - M - CW*3/4, ry + 14, 12, '600', '#475569', 'center');
      });

      const ry2 = dy + 20 + dem.length * 28 + 18;
      T(cx, 'التوصية السريرية', W - M, ry2, 13, '700', '#0f172a');
      HR(cx, ry2 + 11, '#e2e8f0');

      const rec = isHighRisk
        ? 'تم رصد خطر مرتفع للتوحد. نوصي بشدة باستشارة متخصص لإجراء تقييم شامل.'
        : 'لم يتم رصد أي علامات للتوحد. واصل متابعة نمو طفلك بانتظام.';
      const recY = ry2 + 22;
      const recLines = wrapAr(cx, rec, CW - 24, 11);
      const recH = Math.max(50, recLines.length * 18 + 20);
      BOX(cx, M, recY, 4, recH, themeHex);
      BOX(cx, M + 4, recY, CW - 4, recH, themeBg);
      recLines.forEach((l, i) => T(cx, l, W - M - 10, recY + 14 + i * 18, 11, '400', themeHex));

      HR(cx, H - 50, '#cbd5e1');
      T(cx, 'تاريخ الإنشاء: ' + dateStr, W / 2, H - 35, 8, '600', '#64748b', 'center');
      doc.addImage(cv.toDataURL('image/jpeg', 0.95), 'JPEG', 0, 0, 210, 297);
    }

    // ── PAGE 3: Q-CHAT answers ─────────────────────────────────────────────────
    {
      const { cv, cx } = mkPage();
      doc.addPage();
      HDR(cx, 'إجابات استبيان Q-CHAT-10');

      const qY = 82;
      T(cx, 'إجابات الأسئلة', W - M, qY, 13, '700', '#0f172a');
      HR(cx, qY + 11, '#e2e8f0');

      // Column widths (RTL: # rightmost, Answer leftmost)
      const NC = 30, AC = 135, QC = CW - NC - AC;
      const thY = qY + 20;
      BOX(cx, M, thY, CW, 22, '#f1f5f9', '#cbd5e1');
      T(cx, '#',       W - M - NC / 2,         thY + 11, 9, '700', '#475569', 'center');
      T(cx, 'السؤال',  W - M - NC - QC / 2,    thY + 11, 9, '700', '#475569', 'center');
      T(cx, 'الإجابة', M + AC / 2,              thY + 11, 9, '700', '#475569', 'center');

      arQs.forEach((q, i) => {
        const letter = (currentReport.answers || {})[`A${i + 1}`] || '-';
        const idx = ['A','B','C','D','E'].indexOf(letter);
        const ans = idx >= 0 ? arOs[i][idx] : letter;
        const ry = thY + 22 + i * 22;
        BOX(cx, M, ry, CW, 22, i % 2 === 0 ? '#fff' : '#f8fafc', '#e2e8f0');
        T(cx, String(i + 1), W - M - NC / 2,      ry + 11, 9,   '600', '#64748b', 'center');
        T(cx, q,             W - M - NC - 8,        ry + 11, 8.5, '400', '#334155', 'right');
        T(cx, ans,           M + AC - 6,             ry + 11, 9,   '600', '#0f172a', 'right');
      });

      HR(cx, H - 50, '#cbd5e1');
      T(cx, 'تاريخ الإنشاء: ' + dateStr, W / 2, H - 35, 8, '600', '#64748b', 'center');
      doc.addImage(cv.toDataURL('image/jpeg', 0.95), 'JPEG', 0, 0, 210, 297);
    }

    doc.save(`Auto-Ism-تقرير-${childName}.pdf`);
  };

  const displayedCases = cases.slice(0, displayCount);
  const showingAllCases = displayCount >= cases.length && cases.length > 6;
  const toggleCaseDisplay = () => {
    if (showingAllCases) setDisplayCount(6);
    else setDisplayCount(prev => Math.min(prev + 6, cases.length));
  };

  return (
    <div className="cases-page" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="container">
        {error && <div ref={errorRef} className="error-message">{error}</div>}
        {message && <div className="success-message">{message}</div>}

        {view === 'list' && (
          <div>
            <div className="list-header">
              <h2>{t.myCases}</h2>
              <button className="btn btn-primary" onClick={() => setView('create')}>
                <FontAwesomeIcon icon={faPlus} /> {t.createNewCase}
              </button>
            </div>
            {cases.length === 0 ? (
              <div className="empty-state">
                <FontAwesomeIcon icon={faFileMedical} />
                <h3>{t.noCasesYet}</h3>
                <p>{t.createFirstCase}</p>
              </div>
            ) : (
              <>
                <div className="cases-grid">
                  {displayedCases.map(item => (
                    <div key={item.id} className="case-card">
                      <div className="case-card-content">
                        <div className="case-info">
                          <h3>{item.child_name}</h3>
                          <p className="case-dob">{t.dob}: {item.child_dob}</p>
                          {item.brief && <p className="case-brief">{item.brief}</p>}
                          <p className="case-result" dir="auto" style={{lineHeight: '1.6'}}>{getTranslatedCaseResult(item.last_result_summary) || t.noReportYet}</p>
                        </div>
                        <div className="case-actions">
                          <button className="btn btn-primary" onClick={() => {
                            setActiveCase(item);
                            setQchat(emptyQchat);
                            setFaceImage(null);
                            setImageChecked(false);
                            setAssessmentStep('image');
                            setError('');
                            if (imagePreview) URL.revokeObjectURL(imagePreview);
                            setImagePreview('');
                            setView('assessment');
                          }}>
                            <FontAwesomeIcon icon={faPlay} /> {t.test}
                          </button>
                          <button className="btn btn-secondary" onClick={() => openReports(item)}>
                            <FontAwesomeIcon icon={faList} /> {t.reports}
                          </button>
                          <button className="btn btn-danger" onClick={() => deleteCase(item.id)}>
                            <FontAwesomeIcon icon={faTrash} /> {t.delete}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {cases.length > 6 && (
                  <div className="load-more-container">
                    <button onClick={toggleCaseDisplay} className="btn btn-secondary load-more-btn">
                      <FontAwesomeIcon icon={showingAllCases ? faChevronUp : faChevronDown} />
                      {showingAllCases ? t.showLess : `${t.loadMore} (${cases.length - displayCount} ${t.remaining})`}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {view === 'create' && (
          <div className="form-container">
            <h2>{t.createNewCase}</h2>
            <div className="form-group">
              <label>{t.childName}</label>
              <input type="text" className="form-control" value={form.child_name} onChange={e => setForm({...form, child_name: e.target.value})} required />
            </div>
            <div className="form-group">
              <label>{t.dateOfBirth}</label>
              <input
                type="date"
                className="form-control"
                value={form.child_dob}
                max={new Date().toISOString().split('T')[0]}
                onChange={e => {
                  const dob = e.target.value;
                  setForm({...form, child_dob: dob});
                  if (dob) {
                    const months = (new Date().getFullYear() - new Date(dob).getFullYear()) * 12
                      + (new Date().getMonth() - new Date(dob).getMonth());
                    setError(months > 36
                      ? (language === 'ar'
                          ? `هذا التقييم متاح فقط للأطفال حتى 36 شهرًا. عمر هذا الطفل ${months} شهرًا.`
                          : `This assessment is only available for children up to 36 months old. This child is ${months} months old.`)
                      : '');
                  }
                }}
                required
              />
            </div>
            <div className="form-group">
              <label>{t.briefNotes} <span style={{color:'var(--text-muted)', fontSize:'0.85rem'}}>({t.optional})</span></label>
              <textarea className="form-control" rows="4" value={form.brief} onChange={e => setForm({...form, brief: e.target.value})} />
            </div>
            <div className="form-actions">
              <button className="btn btn-secondary" onClick={() => setView('list')}>{t.cancel}</button>
              <button className="btn btn-primary" onClick={createCase}>{t.createCase}</button>
            </div>
          </div>
        )}

        {view === 'assessment' && activeCase && (
          <div>
            <button className="back-button" onClick={() => setView('list')}><FontAwesomeIcon icon={faArrowLeft} /> {t.backToCases}</button>
            <div className="form-container">
              <h2>{t.finalAssessment} {activeCase.child_name}</h2>
              {assessmentStep === 'image' && (
                <>
                  <div className="instructions-box"><h3>{t.photoInstructions}</h3><ul><li>{t.instruction1}</li><li>{t.instruction2}</li><li>{t.instruction3}</li><li>{t.instruction4}</li><li>{t.instruction5}</li><li>{t.instruction6}</li></ul></div>
                  <div className="form-group"><label>{t.uploadImage}</label><input type="file" accept="image/*" className="form-control" onChange={handleImageChange} /></div>
                  {imagePreview && <div className="image-preview"><img src={imagePreview} alt={t.preview} /></div>}
                  <button className="btn btn-primary" onClick={validateFaceAndContinue}>{t.continueToQuestions}</button>
                </>
              )}
              {assessmentStep === 'questions' && (
                <>
                  <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                    <MascotSparkle src={mascotThinking} alt="mascot thinking" width="150px" wrapperStyle={{ margin: '0 auto' }} />
                  </div>
                  <div className={`status-box ${imageChecked ? 'accepted' : ''}`}>{imageChecked ? t.imageAccepted : t.completeQuestions}</div>
                  <div className="form-group"><label>{t.childSex}</label><select className="form-control" value={qchat.child_sex} onChange={e => setAnswer('child_sex', e.target.value)}><option value="">{t.selectSex}</option><option value="male">{t.male}</option><option value="female">{t.female}</option></select></div>
                  <div className="form-group"><label>{t.ethnicity}</label><select className="form-control" value={qchat.child_ethnicity} onChange={e => setAnswer('child_ethnicity', e.target.value)}><option value="">{t.selectEthnicity}</option><option value="white-european">{t.whiteEuropean}</option><option value="asian">{t.asian}</option><option value="middle eastern">{t.middleEastern}</option><option value="black">{t.black}</option><option value="south asian">{t.southAsian}</option><option value="hispanic">{t.hispanic}</option><option value="latino">{t.latino}</option><option value="others">{t.others}</option><option value="mixed">{t.mixed}</option><option value="pacifica">{t.pacifica}</option><option value="native indian">{t.nativeIndian}</option></select></div>
                  <div className="form-group"><label>{t.jaundiceHistory}</label><select className="form-control" value={qchat.jaundice} onChange={e => setAnswer('jaundice', e.target.value)}><option value="">{t.selectOption}</option><option value="no">{t.no}</option><option value="yes">{t.yes}</option></select></div>
                  <div className="form-group"><label>{t.familyASDHistory}</label><select className="form-control" value={qchat.family_asd} onChange={e => setAnswer('family_asd', e.target.value)}><option value="">{t.selectOption}</option><option value="no">{t.no}</option><option value="yes">{t.yes}</option></select></div>
                  {[1,2,3,4,5,6,7,8,9,10].map(i => (
                    <div className="question-group" key={i}>
                      <label>Q{i}. {questionTexts[i]}</label>
                      <div className="options-grid">
                        {answerLetters.map((letter, idx) => (
                          <label key={letter} className={`option-label ${qchat[`A${i}`] === letter ? 'selected' : ''}`}>
                            <input type="radio" name={`A${i}`} value={letter} checked={qchat[`A${i}`] === letter} onChange={e => setAnswer(`A${i}`, e.target.value)} />
                            <span><strong>{letter}</strong> — {options[i][idx]}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                  <button className="btn btn-primary" onClick={submitTest}>{t.runFinalAssessment}</button>
                </>
              )}
            </div>
          </div>
        )}

        {view === 'report' && currentReport && (
          <div className="report-container">
            <button className="back-button" onClick={() => setView('list')}><FontAwesomeIcon icon={faArrowLeft} /> {t.backToCases}</button>
            <div className="report-header">
              {!(currentReport.prediction_label?.toLowerCase().includes('high') || currentReport.prediction_label?.toLowerCase().includes('autism likelihood detected')) && (
                <MascotSparkle src={mascotHappyResult} alt="mascot" width="138px" wrapperStyle={{ marginBottom: '0.5rem' }} />
              )}
              <div className="score-circle">{riskPercent}</div>
              <h2>{language === 'ar' ? getArabicRiskLabel(currentReport.prediction_label) : currentReport.prediction_label}</h2>
            </div>
            <div className="report-body">
              <div className="report-stats">
                <div className="stat-item"><p>{t.qchatScore || 'Q-CHAT Score'}</p><h3>{currentReport.spark_score}/10</h3></div>
                <div className="stat-item"><p>{t.facialRisk || 'Facial risk'}</p><h3>{currentReport.image_score != null ? `${(currentReport.image_score * 100).toFixed(1)}%` : (t.notApplicable || 'N/A')}</h3></div>
                <div className="stat-item"><p>{t.combinedRisk || 'Combined Risk'}</p><h3>{riskPercent}</h3></div>
              </div>
              <div className="report-text" dir="auto">
                {getRecommendation(currentReport, language)}
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center', marginTop: '1rem' }}>
                <button className="btn btn-primary" onClick={generatePDF}>
                  <FontAwesomeIcon icon={faDownload} /> {t.downloadPDF || 'Download PDF (English)'}
                </button>
                <button className="btn btn-secondary" onClick={generateArabicReport}>
                  <FontAwesomeIcon icon={faDownload} /> تحميل التقرير (عربي)
                </button>
              </div>
            </div>
          </div>
        )}

        {view === 'reports' && activeCase && (
          <div>
            <button className="back-button" onClick={() => setView('list')}><FontAwesomeIcon icon={faArrowLeft} /> {t.backToCases}</button>
            <h2>{t.reportsFor} {activeCase.child_name}</h2>

            {gameScores.length > 0 && (
              <div className="game-scores-panel">
                <h3>{t.playAndLearn} {t.score}</h3>
                <div className="game-scores-grid">
                  {gameScores.map((gs) => (
                    <div key={gs.id} className="game-score-card">
                      <p className="game-score-name">{GAME_LABELS[gs.game] || gs.game}</p>
                      <p className="game-score-value">{gs.score}/{gs.max_score}</p>
                      {gs.level && <p className="game-score-level">{t[gs.level] || gs.level}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {reports.length === 0 ? (
              <p>{t.noReportsYet}</p>
            ) : (
              <div className="reports-list">
                {reports.map(r => {
                  const displayLabel = language === 'ar' ? getArabicRiskLabel(r.prediction_label) : r.prediction_label;
                  const displayNotes = getTranslatedCaseResult(r.notes);
                  return (
                    <div key={r.id} className="report-item">
                      <h3>{displayLabel}</h3>
                      <p className="report-date">{new Date(r.created_at).toLocaleString(language === 'ar' ? 'ar-EG' : 'en-US')}</p>
                      <p className="report-notes" dir="auto" style={{lineHeight: '1.6'}}>{displayNotes}</p>
                      <button className="btn btn-primary" onClick={() => {
                        setCurrentReport(r);
                        setView('report');
                      }}>{t.openReport}</button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Cases;