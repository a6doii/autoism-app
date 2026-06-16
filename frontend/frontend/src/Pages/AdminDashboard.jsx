import React, { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { useLanguage } from '../context/LanguageContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSyncAlt } from '@fortawesome/free-solid-svg-icons';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const COLORS_OUTCOME = ['#ef4444', '#10b981'];
const COLOR_POSITIVE = '#ef4444';
const COLOR_NEGATIVE = '#10b981';
const COLORS_AGE = ['#3b82f6', '#0EA5E9', '#10b981', '#f59e0b', '#a855f7', '#ec4899', '#ef4444'];

const AGE_BUCKETS_MONTHS = ['0-6', '6-12', '12-18', '18-24', '24-30', '30-36', '36+'];

const AdminDashboard = () => {
  const { t, language } = useLanguage();
  const [stats, setStats] = useState(null);
  const [ageDistribution, setAgeDistribution] = useState(null);
  const [ageVsResult, setAgeVsResult] = useState(null);
  const [sexVsResult, setSexVsResult] = useState(null);
  const [ethnicityVsResult, setEthnicityVsResult] = useState(null);
  const [users, setUsers] = useState([]);
  const [recentReports, setRecentReports] = useState([]);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const ETHNICITY_LABELS = {
    'white-european': t.whiteEuropean,
    'asian': t.asian,
    'middle eastern': t.middleEastern,
    'black': t.black,
    'south asian': t.southAsian,
    'hispanic': t.hispanic,
    'latino': t.latino,
    'others': t.others,
    'mixed': t.mixed,
    'pacifica': t.pacifica,
    'native indian': t.nativeIndian,
  };

  async function load() {
    try {
      setError('');
      const dash = await api('/admin/dashboard');
      const usersData = await api('/admin/users');
      setStats(dash.stats);
      setAgeDistribution(dash.age_distribution || null);
      setAgeVsResult(dash.age_vs_result || null);
      setSexVsResult(dash.sex_vs_result || null);
      setEthnicityVsResult(dash.ethnicity_vs_result || null);
      setRecentReports(dash.recent_reports || []);
      setUsers(usersData.users || []);
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => { load(); }, []);

  async function handleRefresh() {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }

  async function deleteUser(id) {
    if (!window.confirm(t.deleteConfirm)) return;
    await api(`/admin/users/${id}`, { method: 'DELETE' });
    await load();
  }

  const translateLabel = (label) => {
    if (!label) return '';
    if (t[label]) return t[label];
    if (label === 'Autism likelihood detected') return t.autismDetected || 'تم اكتشاف احتمالية التوحد';
    if (label === 'Low autism likelihood') return t.lowAutismLikelihood || 'احتمالية توحد منخفضة';
    return label;
  };

  const translateNotes = (notes) => {
    if (!notes) return '';
    if (language === 'ar') {
      return notes
        .replace('Q-CHAT risk:', t.qchatRisk || 'خطر Q-CHAT:')
        .replace('Facial risk:', t.facialRisk || 'خطر الوجه:')
        .replace('Final risk:', t.finalRisk || 'الخطر النهائي:');
    }
    return notes;
  };

  const outcomeData = stats ? [
    { name: t.negativeResults, value: stats.negative_tests || 0 },
    { name: t.positiveResults, value: stats.positive_tests || 0 },
  ] : [];

  const ageDistData = ageDistribution
    ? AGE_BUCKETS_MONTHS.map((b) => ({ name: `${b} ${t.ageGroupMonths}`, value: ageDistribution[b] || 0 }))
    : [];

  const ageResultData = ageVsResult
    ? AGE_BUCKETS_MONTHS.map((b) => ({
        name: `${b} ${t.ageGroupMonths}`,
        [t.positiveResults]: ageVsResult[b]?.positive || 0,
        [t.negativeResults]: ageVsResult[b]?.negative || 0,
      }))
    : [];

  const sexResultData = sexVsResult ? [
    { name: t.male, [t.positiveResults]: sexVsResult.male?.positive || 0, [t.negativeResults]: sexVsResult.male?.negative || 0 },
    { name: t.female, [t.positiveResults]: sexVsResult.female?.positive || 0, [t.negativeResults]: sexVsResult.female?.negative || 0 },
  ] : [];

  const ethnicityResultData = ethnicityVsResult
    ? Object.keys(ethnicityVsResult)
        .map((key) => ({
          name: ETHNICITY_LABELS[key] || key,
          [t.positiveResults]: ethnicityVsResult[key]?.positive || 0,
          [t.negativeResults]: ethnicityVsResult[key]?.negative || 0,
        }))
        .filter((d) => d[t.positiveResults] > 0 || d[t.negativeResults] > 0)
    : [];

  const hasAnyTests = stats && stats.total_tests > 0;

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }} dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
        <h1 style={{ margin: 0 }}>{t.adminDashboard}</h1>
        <button className="btn btn-secondary" onClick={handleRefresh} disabled={refreshing}>
          <FontAwesomeIcon icon={faSyncAlt} spin={refreshing} /> {refreshing ? t.refreshing : t.refreshDashboard}
        </button>
      </div>
      {error && <p style={{ color: 'var(--danger)' }}>{error}</p>}

      {stats && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            <div className="form-container" style={{ padding: '1rem', margin: 0 }}>
              <h3>{t.totalAccounts}</h3>
              <p style={{ fontSize: '2rem', color: 'var(--primary)' }}>{stats.total_accounts}</p>
            </div>
            <div className="form-container" style={{ padding: '1rem', margin: 0 }}>
              <h3>{t.totalCases}</h3>
              <p style={{ fontSize: '2rem', color: 'var(--primary)' }}>{stats.total_cases}</p>
            </div>
            <div className="form-container" style={{ padding: '1rem', margin: 0 }}>
              <h3>{t.totalTests}</h3>
              <p style={{ fontSize: '2rem', color: 'var(--primary)' }}>{stats.total_tests}</p>
            </div>
            <div className="form-container" style={{ padding: '1rem', margin: 0 }}>
              <h3>{t.averageRisk}</h3>
              <p style={{ fontSize: '2rem', color: 'var(--primary)' }}>{stats.average_risk}%</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div className="form-container" style={{ padding: '1.5rem', margin: 0 }}>
              <h2 style={{ marginBottom: '1rem', fontSize: '1.2rem' }}>{t.testOutcomes}</h2>
              {hasAnyTests ? (
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie data={outcomeData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={({ value }) => value}>
                      {outcomeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS_OUTCOME[index % COLORS_OUTCOME.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : <p style={{ color: 'var(--text-muted)' }}>{t.noDataYet}</p>}
            </div>

            <div className="form-container" style={{ padding: '1.5rem', margin: 0 }}>
              <h2 style={{ marginBottom: '1rem', fontSize: '1.2rem' }}>{t.ageDistribution}</h2>
              {ageDistData.some((d) => d.value > 0) ? (
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={ageDistData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="value" name={t.numberOfCases} radius={[6, 6, 0, 0]}>
                      {ageDistData.map((entry, index) => (
                        <Cell key={`age-cell-${index}`} fill={COLORS_AGE[index % COLORS_AGE.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : <p style={{ color: 'var(--text-muted)' }}>{t.noCasesYet}</p>}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            <div className="form-container" style={{ padding: '1.5rem', margin: 0 }}>
              <h2 style={{ marginBottom: '1rem', fontSize: '1.2rem' }}>{t.ageVsResult}</h2>
              {hasAnyTests ? (
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={ageResultData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey={t.positiveResults} fill={COLOR_POSITIVE} radius={[6, 6, 0, 0]} />
                    <Bar dataKey={t.negativeResults} fill={COLOR_NEGATIVE} radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : <p style={{ color: 'var(--text-muted)' }}>{t.noDataYet}</p>}
            </div>

            <div className="form-container" style={{ padding: '1.5rem', margin: 0 }}>
              <h2 style={{ marginBottom: '1rem', fontSize: '1.2rem' }}>{t.sexVsResult}</h2>
              {hasAnyTests ? (
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={sexResultData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey={t.positiveResults} fill={COLOR_POSITIVE} radius={[6, 6, 0, 0]} />
                    <Bar dataKey={t.negativeResults} fill={COLOR_NEGATIVE} radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : <p style={{ color: 'var(--text-muted)' }}>{t.noDataYet}</p>}
            </div>

            <div className="form-container" style={{ padding: '1.5rem', margin: 0 }}>
              <h2 style={{ marginBottom: '1rem', fontSize: '1.2rem' }}>{t.ethnicityVsResult}</h2>
              {ethnicityResultData.length > 0 ? (
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={ethnicityResultData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} angle={-20} textAnchor="end" height={60} />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey={t.positiveResults} fill={COLOR_POSITIVE} radius={[6, 6, 0, 0]} />
                    <Bar dataKey={t.negativeResults} fill={COLOR_NEGATIVE} radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : <p style={{ color: 'var(--text-muted)' }}>{t.noDataYet}</p>}
            </div>
          </div>
        </>
      )}

      <div className="form-container" style={{ padding: '1rem', marginBottom: '2rem' }}>
        <h2 style={{ marginBottom: '1rem' }}>{t.allAccounts}</h2>
        <div style={{ display: 'grid', gap: '.75rem' }}>
          {users.map((u) => (
            <div key={u.id} style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '.75rem' }}>
              <div>
                <strong>{u.firstname} {u.lastname}</strong> <span style={{ color: 'var(--text-muted)' }}>({u.email})</span>
                <div style={{ color: 'var(--text-muted)' }}>
                  {t.casesCount}: {u.cases_count} {u.is_admin ? `| ${t.adminBadge}` : ''}
                </div>
              </div>
              {!u.is_admin && (
                <button className="btn btn-danger" onClick={() => deleteUser(u.id)}>
                  {t.deleteUser}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="form-container" style={{ padding: '1rem' }}>
        <h2 style={{ marginBottom: '1rem' }}>{t.recentReports}</h2>
        {recentReports.length === 0 ? (
          <p>{t.noReportsYet}</p>
        ) : (
          recentReports.map((r) => (
            <div key={r.id} style={{ borderBottom: '1px solid #e2e8f0', padding: '.75rem 0' }}>
              <strong>{translateLabel(r.prediction_label)}</strong>
              <div style={{ color: 'var(--text-muted)' }}>{new Date(r.created_at).toLocaleString(language === 'ar' ? 'ar-EG' : 'en-US')}</div>
              <div dir="auto">{translateNotes(r.notes)}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
