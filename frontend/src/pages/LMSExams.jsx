import { motion } from 'framer-motion';
import { FaClipboardList } from 'react-icons/fa';
import LMSSidebar from '../components/LMSSidebar';

const LMSExams = () => (
  <div className="d-flex" style={{ minHeight: '100vh', background: '#0f172a' }}>
    <LMSSidebar />
    <main className="flex-grow-1 p-3 p-lg-4" style={{ minWidth: 0 }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-4">
        <h4 className="fw-bold text-white mb-1">Exams &amp; Assessments</h4>
        <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 14, marginBottom: 0 }}>
          MCQ tests, timed quizzes and score tracking
        </p>
      </motion.div>

      <div className="text-center py-5 rounded-4"
        style={{ background: '#1e293b', border: '1px dashed rgba(255,255,255,0.1)' }}>
        <FaClipboardList size={48} style={{ color: 'rgba(255,255,255,0.15)', marginBottom: 16 }} />
        <p className="text-white fw-semibold mb-1">Exams coming soon</p>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>
          Your instructor will publish exams here once they are ready.
        </p>
      </div>
    </main>
  </div>
);

export default LMSExams;
