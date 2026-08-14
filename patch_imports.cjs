const fs = require('fs');
let content = fs.readFileSync('src/components/RegistrationView.tsx', 'utf8');
content = content.replace("import { \n  Check, AlertCircle, User, Users, LogIn, Sparkles, Trash2, Plus, \n  UserPlus, Trophy, Edit3, CheckCircle2, AlertTriangle, FileText, HelpCircle, ArrowRight\n} from 'lucide-react';", "import { Check, AlertCircle, User, Users, LogIn, Sparkles, Trash2, Plus, UserPlus, Trophy, Edit3, CheckCircle2, AlertTriangle, FileText, HelpCircle, ArrowRight, ShieldCheck, Search } from 'lucide-react';");
fs.writeFileSync('src/components/RegistrationView.tsx', content);
