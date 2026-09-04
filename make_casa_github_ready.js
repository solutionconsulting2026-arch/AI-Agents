const fs = require('fs');

const reactCode = fs.readFileSync('vendor/react.min.js', 'utf8');
const reactDomCode = fs.readFileSync('vendor/react-dom.min.js', 'utf8');
const tailwindCode = fs.readFileSync('vendor/tailwind.js', 'utf8');

// Build the standalone script with cross-navigation
const appScript = `
    const { useState, useEffect, useRef } = React;
    const h = React.createElement;

    // --- INITIAL DATASETS ---
    const CORPORATE_APP = {
      id: 'APP-2026-9841',
      journeyType: 'CORPORATE_CASA',
      title: 'ABC Manufacturing Private Limited',
      entityType: 'Private Limited Company',
      cif: 'CIF-88492019',
      product: 'Corporate Current Account — Gold Advantage',
      branch: 'Mumbai BKC Corporate Hub (0421)',
      rm: 'Aditi Mehta (Senior RM - Corporate Lending)',
      officer: 'Vikram Sen (Senior Scrutiny Officer, ID: 88412)',
      cin: 'U29253MH2012PTC234567',
      pan: 'AAACA1234F',
      gstin: '27AAACA1234F1Z5',
      lei: '33580012345678901234',
      documents: [
        { id: 'd1', name: 'AOF_Corporate_Form_Signed.pdf', type: 'Account Opening Form (AOF)', pages: 4, status: 'Extracted', conf: 99 },
        { id: 'd2', name: 'Corporate_PAN_Card.pdf', type: 'Company PAN Card', pages: 1, status: 'Verified', conf: 99 },
        { id: 'd3', name: 'Certificate_of_Incorporation_MOA.pdf', type: 'MCA COI & MOA', pages: 12, status: 'Verified', conf: 98 },
        { id: 'd4', name: 'GST_Registration_Certificate_REG06.pdf', type: 'GST Certificate', pages: 3, status: 'Verified', conf: 99 },
        { id: 'd5', name: 'Board_Resolution_Signatories.pdf', type: 'Board Resolution & POA', pages: 2, status: 'Extracted', conf: 96 },
        { id: 'd6', name: 'Signatory_KYC_Dossier.pdf', type: 'Director / Signatory KYC', pages: 6, status: 'Verified', conf: 99 }
      ]
    };

    function PromptDrivenCASAWireframe() {
      const [promptText, setPromptText] = useState('');
      const [isExecuting, setIsExecuting] = useState(false);
      const [executionLogs, setExecutionLogs] = useState([
        { time: '10:40:12 AM', sender: 'System', text: 'Staged 6 borrower documents from CRM DMS for APP-2026-9841.' },
        { time: '10:40:15 AM', sender: 'Document AI', text: 'Completed OCR extraction (186 fields extracted with 98.4% average confidence).' },
        { time: '10:40:18 AM', sender: 'CASA Scrutiny Agent', text: 'Initialized Post-Document AI reasoning layer. Awaiting officer prompt or action.' }
      ]);
      const [addressState, setAddressState] = useState('Unit 401-A, 4th Floor, Tech Park, Andheri East, Mumbai 400069');
      const [addressStatus, setAddressStatus] = useState('MISMATCH'); // 'MISMATCH' | 'MATCH'
      const [exceptionStatus, setExceptionStatus] = useState('OPEN'); // 'OPEN' | 'RESOLVED'
      const [resolutionNote, setResolutionNote] = useState(null);
      const [statutoryStatus, setStatutoryStatus] = useState({ pan: 'ACTIVE', gst: 'ACTIVE', mca: 'ACTIVE (Address Note)', ckyc: 'VERIFIED' });
      const [readinessScore, setReadinessScore] = useState(92);
      const [cbsStatus, setCbsStatus] = useState('UNTRANSMITTED'); // 'UNTRANSMITTED' | 'TRANSMITTED'
      const [isJsonOpen, setIsJsonOpen] = useState(false);

      const logsEndRef = useRef(null);
      useEffect(() => {
        if (logsEndRef.current) logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
      }, [executionLogs]);

      const appendLog = (sender, text) => {
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        setExecutionLogs(prev => [...prev, { time, sender, text }]);
      };

      const handleExecutePrompt = (customPrompt) => {
        const query = customPrompt || promptText;
        if (!query.trim()) return;

        setIsExecuting(true);
        appendLog('Officer Prompt', \`"\${query}"\`);

        const lower = query.toLowerCase();

        setTimeout(() => {
          if (lower.includes('pan') || lower.includes('gst') || lower.includes('statutory')) {
            appendLog('Agent Action', 'Calling NSDL PAN API (AAACA1234F) and GSTN Portal (27AAACA1234F1Z5)...');
            setTimeout(() => {
              setStatutoryStatus(prev => ({ ...prev, pan: 'ACTIVE (100% Match)', gst: 'ACTIVE (Regular - 0 Defaults)' }));
              appendLog('Agent Result', '✓ NSDL PAN: Active & Validated | ✓ GSTN: Active Regular, 0 Return defaults.');
              setIsExecuting(false);
            }, 800);
          } else if (lower.includes('address') || lower.includes('mca') || lower.includes('resolve') || lower.includes('standardize') || lower.includes('scrutiny') || lower.includes('full')) {
            appendLog('Agent Action', 'Executing Cross-Document matching and verifying against MCA21 Registry...');
            setTimeout(() => {
              appendLog('Agent Action', 'Found address discrepancy (AOF 401-A vs MCA 402). Applying directive: Standardize address to official MCA ROC records...');
              setTimeout(() => {
                setAddressState('Unit 402, 4th Floor, Tech Park, Andheri East, Mumbai 400069 (Standardized to MCA)');
                setAddressStatus('MATCH');
                setExceptionStatus('RESOLVED');
                setResolutionNote('Auto-standardized to official MCA21 ROC master registry as requested in prompt.');
                setReadinessScore(98);
                appendLog('Agent Result', '✓ Updated CRM AOF Address field to Unit 402.');
                appendLog('Agent Result', '✓ Resolved Exception EXC-004. Account Readiness Score updated to 98/100 (READY).');
                setIsExecuting(false);
              }, 900);
            }, 800);
          } else if (lower.includes('cbs') || lower.includes('transmit') || lower.includes('open')) {
            appendLog('Agent Action', 'Generating RFC-compliant Core Banking JSON payload and calling Finacle CBS API...');
            setTimeout(() => {
              setCbsStatus('TRANSMITTED');
              appendLog('Agent Result', '✓ Successfully created Current Account in CBS! Generated Account No: 04210020019283.');
              appendLog('Agent Result', '✓ Sealed 10-Year WORM Audit Record (sha256:7f9b8c2d1e0a4f5c9e2b8a1d7f6c3b0a).');
              setIsExecuting(false);
            }, 1000);
          } else {
            appendLog('Agent Action', 'Parsing generic banking prompt and executing complete scrutiny pipeline...');
            setTimeout(() => {
              setAddressState('Unit 402, 4th Floor, Tech Park, Andheri East, Mumbai 400069 (Standardized to MCA)');
              setAddressStatus('MATCH');
              setExceptionStatus('RESOLVED');
              setResolutionNote('Validated all schedules and standardized records per prompt instructions.');
              setReadinessScore(98);
              appendLog('Agent Result', '✓ Scrutiny completed. Readiness status elevated to READY FOR CBS (98/100).');
              setIsExecuting(false);
            }, 1000);
          }
        }, 600);

        setPromptText('');
      };

      return h('div', { className: 'min-h-screen flex flex-col bg-slate-950 font-sans' },
        
        // 1. Top Bar with Relative Link to Flow 01
        h('header', { className: 'h-16 bg-slate-900 border-b border-slate-800 px-6 flex items-center justify-between shadow-lg' },
          h('div', { className: 'flex items-center gap-3' },
            h('div', { className: 'w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-bold text-white shadow-md' }, 'AI'),
            h('div', null,
              h('div', { className: 'text-sm font-bold tracking-tight text-white flex items-center gap-2' },
                'APEX BANKING CRM',
                h('span', { className: 'text-[10px] bg-blue-500/20 text-blue-300 font-semibold px-2 py-0.5 rounded-full border border-blue-400/30' }, 'PROMPT-DRIVEN AGENT')
              ),
              h('div', { className: 'text-[11px] text-slate-400' }, 'CASA Scrutiny & Reasoning Engine')
            )
          ),
          h('div', { className: 'flex items-center gap-3' },
            h('a', {
              href: './index.html',
              className: 'flex items-center gap-1.5 px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600/40 text-blue-300 border border-blue-500/40 rounded-lg text-xs font-bold transition-all'
            }, '← Open Flow 01 (Financial Extraction)'),
            h('div', { className: 'text-right hidden sm:block' },
              h('div', { className: 'text-xs font-bold text-slate-200' }, 'Vikram Sen'),
              h('div', { className: 'text-[10px] text-slate-400' }, 'Senior Scrutiny Officer (ID: 88412)')
            ),
            h('button', {
              onClick: () => setIsJsonOpen(true),
              className: 'px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-bold'
            }, '{ } Output JSON')
          )
        ),

        // 2. Application Context Banner
        h('div', { className: 'bg-slate-900/60 border-b border-slate-800 px-6 py-3.5' },
          h('div', { className: 'flex flex-wrap items-center justify-between gap-4' },
            h('div', null,
              h('div', { className: 'text-xs text-slate-400 flex items-center gap-2' },
                h('span', null, 'CASA Onboarding Pipeline'),
                h('span', null, '→'),
                h('span', { className: 'font-mono text-blue-400 font-semibold' }, CORPORATE_APP.id)
              ),
              h('div', { className: 'flex items-center gap-3 mt-0.5' },
                h('h1', { className: 'text-lg font-bold text-white' }, CORPORATE_APP.title),
                h('span', { className: 'px-2 py-0.5 bg-slate-800 border border-slate-700 rounded text-xs font-mono text-slate-300' }, CORPORATE_APP.cif),
                h('span', { className: \`px-2.5 py-0.5 rounded-full text-xs font-bold \${exceptionStatus === 'RESOLVED' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'}\` },
                  exceptionStatus === 'RESOLVED' ? 'READY FOR CBS ACCOUNT CREATION' : 'REQUIRES OFFICER REVIEW (1 Exception)'
                )
              )
            ),
            h('div', { className: 'flex items-center gap-3 text-xs' },
              h('div', { className: 'bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700' },
                h('span', { className: 'text-slate-400 block text-[10px] uppercase font-bold' }, 'Product'),
                h('span', { className: 'font-bold text-slate-200' }, CORPORATE_APP.product)
              ),
              h('div', { className: 'bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700' },
                h('span', { className: 'text-slate-400 block text-[10px] uppercase font-bold' }, 'Readiness Score'),
                h('span', { className: \`font-bold font-mono text-sm \${readinessScore >= 95 ? 'text-emerald-400' : 'text-amber-400'}\` }, \`\${readinessScore} / 100\`)
              )
            )
          )
        ),

        // 3. PROMPT & COMMAND INPUT CONSOLE
        h('div', { className: 'bg-gradient-to-b from-slate-900 to-slate-950 p-6 border-b border-slate-800 shadow-inner' },
          h('div', { className: 'max-w-5xl mx-auto space-y-3' },
            h('div', { className: 'flex items-center justify-between text-xs' },
              h('div', { className: 'font-bold text-blue-300 flex items-center gap-2' },
                h('span', { className: 'w-2 h-2 rounded-full bg-blue-500 animate-pulse' }),
                'AGENT INSTRUCTION CONSOLE: Give a prompt to command the agent in your CRM'
              ),
              h('span', { className: 'text-slate-400 text-[11px]' }, 'Natural Language Multi-Tool ReAct Engine')
            ),

            // Main Prompt Box
            h('div', { className: 'relative flex items-center' },
              h('input', {
                type: 'text',
                value: promptText,
                onChange: (e) => setPromptText(e.target.value),
                onKeyDown: (e) => { if (e.key === 'Enter') handleExecutePrompt(); },
                placeholder: 'e.g. "Run full scrutiny on ABC Mfg, verify against MCA21 & NSDL, and standardize address to MCA records"',
                className: 'w-full pl-4 pr-36 py-3 bg-slate-900 border-2 border-blue-500/40 focus:border-blue-500 rounded-xl text-sm text-white placeholder-slate-500 shadow-lg focus:outline-none transition-all'
              }),
              h('button', {
                onClick: () => handleExecutePrompt(),
                disabled: isExecuting,
                className: \`absolute right-2 px-5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 \${
                  isExecuting ? 'bg-blue-800 text-blue-300 cursor-wait' : 'bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-900/50'
                }\`
              },
                isExecuting ? [
                  h('span', { key: 'spin', className: 'w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin' }),
                  h('span', { key: 'txt' }, 'Executing...')
                ] : [
                  h('span', { key: 'txt' }, 'Execute in CRM →')
                ]
              )
            ),

            // Quick Prompt Suggestions
            h('div', { className: 'flex flex-wrap items-center gap-2 pt-1' },
              h('span', { className: 'text-[11px] text-slate-400 font-semibold' }, 'Suggested Prompts:'),
              [
                'Run full scrutiny and cross-validate against MCA & PAN',
                'Verify NSDL PAN & GSTN status',
                'Standardize address to official MCA ROC records',
                'Transmit validated application to Core Banking (CBS)'
              ].map((p, idx) => h('button', {
                key: idx,
                onClick: () => handleExecutePrompt(p),
                className: 'px-2.5 py-1 bg-slate-800/80 hover:bg-blue-950 text-slate-300 hover:text-blue-300 border border-slate-700 hover:border-blue-500/50 rounded-lg text-[11px] font-medium transition-colors'
              }, \`💡 "\${p}"\`))
            )
          )
        ),

        // 4. Tri-Pane Main Operational Workspace
        h('main', { className: 'flex-1 grid grid-cols-12 gap-6 p-6 max-w-7xl mx-auto w-full' },
          
          // Pane 1: Real-Time Agent Execution Telemetry (4 Cols)
          h('div', { className: 'col-span-12 lg:col-span-4 flex flex-col bg-slate-900 rounded-2xl border border-slate-800 p-5 shadow-xl h-[520px]' },
            h('div', { className: 'flex items-center justify-between pb-3 border-b border-slate-800 mb-3' },
              h('h3', { className: 'font-bold text-xs uppercase text-slate-300 flex items-center gap-2' },
                h('span', { className: 'w-2 h-2 rounded-full bg-emerald-400' }),
                'Agent Execution Stream'
              ),
              h('span', { className: 'text-[10px] font-mono text-slate-500' }, 'ReAct Log')
            ),

            h('div', { className: 'flex-1 overflow-y-auto space-y-2.5 pr-1 text-xs' },
              executionLogs.map((log, i) => h('div', {
                key: i,
                className: \`p-2.5 rounded-xl border \${
                  log.sender === 'Officer Prompt' ? 'bg-blue-950/60 border-blue-500/40 text-blue-200' :
                  log.sender === 'Agent Action' ? 'bg-slate-800/80 border-slate-700 text-slate-300 font-mono text-[11px]' :
                  log.sender === 'Agent Result' ? 'bg-emerald-950/50 border-emerald-700/60 text-emerald-300 font-bold' :
                  'bg-slate-800/40 border-slate-800 text-slate-400'
                }\`
              },
                h('div', { className: 'flex justify-between items-center text-[10px] mb-1 opacity-75' },
                  h('span', { className: 'font-bold' }, log.sender),
                  h('span', { className: 'font-mono' }, log.time)
                ),
                h('div', { className: 'leading-relaxed' }, log.text)
              )),
              h('div', { ref: logsEndRef })
            )
          ),

          // Pane 2: Reactive CRM Data Canvas (5 Cols)
          h('div', { className: 'col-span-12 lg:col-span-5 bg-slate-900 rounded-2xl border border-slate-800 p-5 shadow-xl space-y-4 h-[520px] overflow-y-auto' },
            h('div', { className: 'flex items-center justify-between pb-3 border-b border-slate-800' },
              h('h3', { className: 'font-bold text-xs uppercase text-slate-300' }, 'Live CRM Data Canvas (Post-AI)'),
              h('span', { className: 'text-[10px] text-blue-400 font-mono font-bold' }, 'Mutated by Agent')
            ),

            // Cross-Document Matched Matrix
            h('div', { className: 'space-y-2' },
              h('div', { className: 'text-[11px] font-bold text-slate-400 uppercase tracking-wider' }, 'Cross-Document Reconciliation Matrix'),
              h('div', { className: 'space-y-2 text-xs' },
                [
                  { label: 'Legal Entity Name', val: 'ABC Manufacturing Private Limited', match: true },
                  { label: 'Corporate PAN', val: 'AAACA1234F (NSDL Verified)', match: true },
                  { label: 'Registered Office Address', val: addressState, match: addressStatus === 'MATCH' },
                  { label: 'CIN Number', val: 'U29253MH2012PTC234567 (MCA Active)', match: true },
                  { label: 'Authorized Signatories', val: 'Rahul Sharma (DIN) & Sunita Rao (DIN)', match: true }
                ].map((item, idx) => h('div', { key: idx, className: 'p-3 bg-slate-800/60 rounded-xl border border-slate-700/80 space-y-1' },
                  h('div', { className: 'flex items-center justify-between font-bold' },
                    h('span', { className: 'text-slate-300' }, item.label),
                    h('span', { className: \`px-2 py-0.5 rounded-full text-[10px] \${item.match ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse'}\` },
                      item.match ? '✓ MATCH / PASS' : '! MISMATCH FLAGGED'
                    )
                  ),
                  h('div', { className: 'font-mono text-[11px] text-slate-200 mt-1' }, item.val)
                ))
              )
            ),

            // Statutory APIs Live Status
            h('div', { className: 'space-y-2 pt-2 border-t border-slate-800' },
              h('div', { className: 'text-[11px] font-bold text-slate-400 uppercase tracking-wider' }, 'External Government Gateways'),
              h('div', { className: 'grid grid-cols-2 gap-2 text-xs font-mono' },
                h('div', { className: 'p-2.5 bg-slate-800/80 rounded-lg border border-slate-700' },
                  h('div', { className: 'text-slate-400 text-[10px]' }, 'NSDL PAN Gateway:'),
                  h('div', { className: 'font-bold text-emerald-400' }, statutoryStatus.pan)
                ),
                h('div', { className: 'p-2.5 bg-slate-800/80 rounded-lg border border-slate-700' },
                  h('div', { className: 'text-slate-400 text-[10px]' }, 'GSTN Portal:'),
                  h('div', { className: 'font-bold text-emerald-400' }, statutoryStatus.gst)
                )
              )
            )
          ),

          // Pane 3: Action Workbench & Core Banking Transmission (3 Cols)
          h('div', { className: 'col-span-12 lg:col-span-3 space-y-4' },
            
            // Exception Status Card
            h('div', { className: \`p-5 rounded-2xl border transition-all \${exceptionStatus === 'OPEN' ? 'bg-amber-950/40 border-amber-600/60' : 'bg-slate-900 border-slate-800'}\` },
              h('div', { className: 'flex justify-between items-center mb-2' },
                h('span', { className: \`px-2 py-0.5 rounded text-[10px] font-bold \${exceptionStatus === 'OPEN' ? 'bg-amber-500/30 text-amber-300 border border-amber-500/40' : 'bg-emerald-500/30 text-emerald-300 border border-emerald-500/40'}\` },
                  exceptionStatus === 'OPEN' ? 'EXC-004 · ACTIVE' : 'RESOLVED BY AGENT'
                ),
                h('span', { className: 'text-[10px] text-slate-400 font-bold' }, 'Address Variance')
              ),
              h('div', { className: 'text-xs font-bold text-slate-200' }, 'AOF Unit 401-A vs MCA Unit 402'),
              h('p', { className: 'text-[11px] text-slate-400 mt-2 leading-relaxed' },
                exceptionStatus === 'OPEN' 
                  ? 'Internal wing/floor reconfiguration without Form INC-22 ROC update. Give a prompt or select action below.'
                  : \`Resolution Note: \${resolutionNote}\`
              ),

              exceptionStatus === 'OPEN' && h('div', { className: 'mt-4 pt-3 border-t border-amber-700/60 space-y-2' },
                h('button', {
                  onClick: () => handleExecutePrompt('Standardize address to official MCA ROC records'),
                  className: 'w-full py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold shadow transition-all'
                }, 'Auto-Standardize to MCA (402)'),
                h('button', {
                  onClick: () => handleExecutePrompt('Accept address difference using lease agreement note'),
                  className: 'w-full py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium border border-slate-700'
                }, 'Accept Difference with Note')
              )
            ),

            // Final Account Readiness & CBS Transmission
            h('div', { className: 'bg-slate-900 rounded-2xl border border-slate-800 p-5 shadow-xl space-y-3 text-xs' },
              h('div', { className: 'flex justify-between items-center pb-2 border-b border-slate-800' },
                h('span', { className: 'font-bold uppercase text-slate-400 text-[10px]' }, 'Core Banking Hand-off'),
                h('span', { className: \`font-bold \${readinessScore >= 95 ? 'text-emerald-400' : 'text-amber-400'}\` }, \`\${readinessScore}/100\`)
              ),
              h('p', { className: 'text-[11px] text-slate-400' },
                cbsStatus === 'TRANSMITTED'
                  ? 'Current Account active in Core Banking (Finacle). Account No: 04210020019283.'
                  : (readinessScore >= 95 ? 'Application is fully verified and ready for instant CBS account creation.' : 'Resolve the open address discrepancy to enable CBS transmission.')
              ),
              h('button', {
                onClick: () => handleExecutePrompt('Transmit approved application to Core Banking CBS'),
                disabled: readinessScore < 95 || cbsStatus === 'TRANSMITTED',
                className: \`w-full py-3 rounded-xl font-bold text-xs shadow-lg transition-all \${
                  cbsStatus === 'TRANSMITTED' ? 'bg-emerald-600 text-white cursor-default' : (readinessScore >= 95 ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-600/30' : 'bg-slate-800 text-slate-500 cursor-not-allowed')
                }\`
              }, cbsStatus === 'TRANSMITTED' ? '✓ Account Created in CBS (Finacle)' : 'Transmit to Core Banking (CBS)')
            )
          )
        ),

        // Output JSON Modal
        isJsonOpen && h('div', { className: 'fixed inset-0 bg-black/70 backdrop-blur-xs z-50 flex items-center justify-center p-4' },
          h('div', { className: 'bg-slate-900 text-slate-200 rounded-2xl w-full max-w-2xl border border-slate-800 shadow-2xl p-6 space-y-4' },
            h('div', { className: 'flex justify-between items-center pb-3 border-b border-slate-800' },
              h('h3', { className: 'font-bold text-white text-sm' }, 'Machine-Readable Output Payload (JSON)'),
              h('button', { onClick: () => setIsJsonOpen(false), className: 'text-slate-400 hover:text-white font-bold' }, '✕')
            ),
            h('pre', { className: 'bg-slate-950 p-4 rounded-xl text-emerald-400 font-mono text-xs overflow-auto max-h-96' },
JSON.stringify({
  application_id: CORPORATE_APP.id,
  journey_type: CORPORATE_APP.journeyType,
  cif: CORPORATE_APP.cif,
  entity_name: CORPORATE_APP.title,
  pan: CORPORATE_APP.pan,
  cin: CORPORATE_APP.cin,
  registered_address: addressState,
  readiness_status: readinessScore >= 95 ? 'APPROVED' : 'REQUIRES_REVIEW',
  readiness_score: readinessScore,
  statutory_checks: statutoryStatus,
  cbs_account_number: cbsStatus === 'TRANSMITTED' ? '04210020019283' : null,
  audit_metadata: {
    officer: CORPORATE_APP.officer,
    decision_hash: 'sha256:7f9b8c2d1e0a4f5c9e2b8a1d7f6c3b0a',
    retention_years: 10
  }
}, null, 2)
            ),
            h('div', { className: 'flex justify-end' },
              h('button', { onClick: () => setIsJsonOpen(false), className: 'px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold' }, 'Close Inspector')
            )
          )
        )
      );
    }

    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(h(PromptDrivenCASAWireframe));
`;

const standaloneHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>CASA Onboarding Scrutiny Agent · Prompt-Driven CRM Wireframe</title>
  
  <!-- Embedded Tailwind CSS Engine -->
  <script>${tailwindCode}</script>
  
  <!-- Embedded React 18 & ReactDOM 18 -->
  <script>${reactCode}</script>
  <script>${reactDomCode}</script>

  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      -webkit-font-smoothing: antialiased;
      overflow-x: hidden;
      background-color: #0f172a;
      color: #f8fafc;
    }
    ::-webkit-scrollbar { width: 5px; height: 5px; }
    ::-webkit-scrollbar-track { background: rgba(15, 23, 42, 0.6); }
    ::-webkit-scrollbar-thumb { background: #334155; border-radius: 4px; }
    ::-webkit-scrollbar-thumb:hover { background: #475569; }
  </style>
</head>
<body class="bg-slate-950 text-slate-100 select-none">
  <div id="root"></div>

  <script>
    ${appScript}
  </script>
</body>
</html>`;

fs.writeFileSync('casa_scrutiny_wireframe.html', standaloneHtml, 'utf8');
console.log('Generated prompt-driven, self-contained casa_scrutiny_wireframe.html with embedded libraries! Size: ' + standaloneHtml.length + ' bytes');
