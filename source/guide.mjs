// Version 2 content: the persona, the seats, the system and the builder's map.
// Every factual statement cites a source id from data.mjs. Amounts come from model.mjs.

export const persona={
 name:'Maya',full:'Maya Okonkwo',age:34,role:'product designer',employer:'a 400-person software company',
 plan:'Her plan has a $2,000 deductible, 20% coinsurance after it and a $5,000 out-of-pocket maximum. Behavioral health has a separate administrator. The employer funds the claims; the insurer on the card runs the plan for a fee.',
 year:'Maya sees a therapist by video every month from January. In March her doctor orders an MRI, which she has at a hospital outpatient department. In September she goes to an emergency department after a fall.'
};

export const cardTech={brand:'The administrator appears as the payer name on the 835 remittance. The funder appears in no transaction; it is known only from the plan documents.',member:'Member ID fills the subscriber or dependent loops of the 270/271 and the 837. Dependents carry their own identifiers on some plans and the subscriber’s on others.',group:'The group number travels in the 271 and 837 as a policy or group reference (REF segments) and selects the benefit configuration.',network:'Product and network names come back in the 271 plan description fields. A provider’s contract status for that network is a contracting fact, held outside the transaction.',benefits:'Printed values are static. The 271 EB segments carry the current deductible and out-of-pocket amounts remaining, which is what an estimate should use.',rx:'BIN, PCN and Rx group route NCPDP D.0 telecommunication claims to the PBM. Pharmacy claims never pass through the X12 medical path.',payer:'The payer ID selects the clearinghouse route and becomes the receiver identifier on the 837. One organization can publish several.',behavioral:'A second payer ID is a second trading partner: its own eligibility endpoint, submission route and 835 source, and often a different clearinghouse.',foot:'Self-funded status changes the regulator (DOL under ERISA), the appeal path and who signs the administrative services agreement. The transactions look identical.'};

// The insurance card, field by field. Each field names the party that reads it and the system it keys.
export const card={
 brand:'Northwind Health',plan:'Choice PPO · Open Access',
 fields:[
  ['brand','Administrator brand','Northwind Health','The organization that runs the plan: eligibility, the provider network, claims processing and member service. In a fully insured plan this company also carries the claims risk. In Maya’s self-funded plan the employer carries it and pays this company a fee. The card looks the same in both cases.','The front desk, the member, the clearinghouse','funding','dol'],
  ['member','Member name and ID','MAYA OKONKWO · W204 118 773','Identifies the subscriber or dependent in the administrator’s eligibility system. It goes on every eligibility inquiry (X12 270) and every claim, and it changes when the person changes plans.','The provider, the clearinghouse, the administrator','eligibility','identifiers'],
  ['group','Group number','GRP 7714-02','Identifies the employer’s contract, and with it the benefit design: deductible, coinsurance, network and plan year. Two members of one insurer with different group numbers can have entirely different benefits.','The administrator, the benefits platform, the broker','dol','glossary'],
  ['network','Plan type and network','PPO · Choice network','The access rules (referrals, out-of-network coverage) and the contract a provider must hold to be in network. A provider can be in one of a company’s networks and outside another, so the network name matters more than the brand.','The scheduler, the member','glossary'],
  ['benefits','Printed cost sharing','DED $2,000 · OOP MAX $5,000 · COINS 20%','A summary for the member. The exact benefit today, including the deductible remaining, comes from the eligibility response or the plan documents.','The member; a hint for the front desk','eligibility','sbc'],
  ['rx','Rx BIN · PCN · Rx Group','BIN 610014 · PCN NWRX · GRP NWCOM','Routing for a pharmacy claim. The BIN and PCN identify the pharmacy benefit manager’s processing system and the Rx group identifies the benefit. Pharmacy claims use the NCPDP standard and run on a separate system, often at a separate company.','The pharmacy, the PBM','ncpdpcard','standards'],
  ['payer','Payer ID','PAYER ID 87726','The electronic address for claims. A clearinghouse uses it to route the X12 837 to the right adjudication system. One company can hold several payer IDs for different lines of business or acquired plans.','The billing office, the clearinghouse','claims','identifiers'],
  ['behavioral','Behavioral health','Mental health and substance use: 800-555-0188 · Payer ID 68294','Many cards print a mental health line. A phone number alone can route to the same administrator; a separate payer ID or claims address means those claims go to a different one, a carve-out. Maya’s plan is carved out, so her therapist checks eligibility and submits claims there, and the eligibility response confirms it.','The therapist’s biller, the member','idcard','carveout','parity'],
  ['foot','Administered on behalf of','Administered by Northwind Health for the Fairline Software Group Health Plan','This line says who holds the money. The employer’s plan is the funder and fiduciary; the insurer is its administrator. ERISA governs most plans like this one.','The member who reads the fine print; the regulator','funding','erisa','stoploss']
 ]
};

export const year={
 headline:['The same MRI costs Maya a different amount in ','March',' and in November.'],
 lede:'Cost sharing accumulates. Allowed amounts count toward the deductible until it is met, then coinsurance applies, until the out-of-pocket maximum stops the member’s spending. What a service costs the member depends on everything billed before it in the plan year.',
 lede2:'Move the deductible, or move the MRI to another month, and the year reflows. Premium contributions sit outside these limits.',
 builder:'A patient cost estimate needs the accumulators as of today, which come from the eligibility response. A claim that adjudicates tomorrow changes them.',
 sources:['glossary','eligibility','sbc']
};

export const waterfall={
 headline:['The bill, the allowed amount, the member’s share and the ','write-off',' are four different numbers.'],
 lede:'A provider bills its full charge. The administrator prices the claim at the contracted amount, which is usually far lower, and the provider writes off the difference as a contractual adjustment. The allowed amount is then split between the member and the plan under the benefits in force that day.',
 lede2:'The write-off is the number newcomers miss. It explains why a hospital’s list prices say little about what any party pays.',
 builder:'Store all five values on every claim line: billed, allowed, member, plan, write-off. An unqualified “amount” field is the most common data-model mistake in healthcare software.',
 sources:['eob','payment','transparency']
};

// The seats around the table. Each answers the same six questions.
export const seats=[
 {id:'member',label:'Member and employer',short:'Member',kind:'THE MEMBER AND THE EMPLOYER BEHIND THE CARD',
  headline:['Maya chose from the plans her employer chose, and her employer ','funds',' the claims.'],
  lede:'Maya picked a plan at open enrollment and pays part of the premium from each paycheck. Her employer pays the rest and, because the plan is self-funded, pays the claims from its own money. The insurer on the card is its administrator, and stop-loss insurance covers the largest claims.',
  six:[
   ['What they want','Maya: care she can reach, a predictable bill, a network with her doctors. The employer: a benefit that recruits and retains people at a cost it can forecast.'],
   ['Where the money goes','Payroll contributions plus the employer’s share fund expected claims and administration. In 2025 the average worker paid $1,440 of a $9,325 single premium. Cost sharing comes on top when care is used.'],
   ['What hurts','For Maya: a surprise bill, a denied authorization, a therapist outside the network. For the employer: cost trend above budget, a few catastrophic claims, vendor contracts it cannot see inside.'],
   ['Documents and systems','The summary of benefits and coverage, the plan description, the card and the EOB. Behind them, the benefits platform, the enrollment file (X12 834) to each vendor, and the administrator’s portal.'],
   ['Words that shift','“Plan” is the benefit arrangement. “Group” is the employer’s covered population. “Premium” keeps coverage in force and sits outside the deductible.'],
   ['Where software helps','Benefits administration and enrollment, decision support at open enrollment, cost estimates, navigation to in-network care, and claims analytics for self-funded employers.']
  ],
  builder:'The employer is a buyer with a budget, a broker and a plan year that often begins January 1. Most products reach members through the employer or its administrator.',
  sources:['kff','dol','funding','stoploss','enrollment','sbc']},
 {id:'practice',label:'Physician practice',short:'Practice',kind:'THE PHYSICIAN PRACTICE',
  headline:['A practice is paid a ','contracted',' rate for a coded visit, weeks after the visit.'],
  lede:'Maya’s doctor belongs to a group practice. The practice is credentialed with each payer it accepts and signs a contract with a fee schedule, often set as a percentage of Medicare rates. Each visit becomes diagnosis and procedure codes, then a professional claim, then a payment and a patient balance.',
  six:[
   ['What they want','Clean claims that pay the first time, authorizations that keep pace with care, patient balances that get collected, and time with patients.'],
   ['Where the money goes','A fee per coded service at the contracted rate, plus the member’s cost sharing. Value-based contracts add shared savings or a payment per member.'],
   ['What hurts','Denials, prior authorization, days in accounts receivable, and credentialing that keeps a new clinician from billing for months. Marketplace insurers denied about 19% of in-network claims in 2024.'],
   ['Documents and systems','The EHR for the record, the practice management system for scheduling and billing, a clearinghouse, and often a billing service or revenue cycle vendor.'],
   ['Words that shift','“Provider” can be the clinician who rendered the service, the group that bills, or the entity that is paid. A claim carries all three, and they can be three different NPIs.'],
   ['Where software helps','Eligibility before the visit, prior authorization, coding assistance, claim scrubbing, denial management, patient estimates and payments, value-based reporting.']
  ],
  builder:'Selling to a practice means selling time back to the clinician or cash back to the office. Measure days in A/R, first-pass acceptance and denial rate before and after.',
  sources:['pfs','kffrates','enrollmentpecos','caqh','cpt','icd','claims','denials','aco']},
 {id:'hospital',label:'Hospital',short:'Hospital',kind:'THE HOSPITAL',
  headline:['One hospital visit produces ','two',' claims, each priced by contract.'],
  lede:'Maya’s MRI and her emergency visit each produced a facility claim from the hospital and a professional claim from the clinician. The hospital bills from its chargemaster, a list of charges for everything it does, and is paid according to contracts. For inpatient stays, Medicare and many commercial contracts pay a fixed amount per diagnosis-related group.',
  six:[
   ['What they want','Authorized admissions and procedures paid at contracted rates, a short stay for each diagnosis group, and collection of patient balances without losing patients.'],
   ['Where the money goes','Facility payment by case rate, per diem, percentage of charges or fee schedule, plus patient cost sharing and government programs. Uncompensated care becomes charity care or bad debt.'],
   ['What hurts','Medical-necessity denials, inpatient-versus-observation disputes, downgraded level of care, and the cost of a revenue cycle department large enough to contest all of them.'],
   ['Documents and systems','The institutional claim (UB-04 or X12 837I) with revenue codes, the chargemaster, the hospital EHR, utilization review and case management, and a revenue cycle platform across several vendors.'],
   ['Words that shift','“Charge” is the list price and “rate” the contracted amount. A “facility fee” covers the room, equipment and staff, billed apart from the physician. “Observation” is an outpatient status that looks like an admission.'],
   ['Where software helps','Prior authorization and utilization review, coding and documentation, denial prevention and appeals, price transparency files and estimates, patient financing, remittance reconciliation.']
  ],
  builder:'Selling to a hospital means selling against denials and days in A/R, to a buyer in revenue cycle or finance. The clinical pitch gets a meeting; the cash pitch gets a contract.',
  sources:['ub04','ipps','observation','chargemaster','transparency','facilityfee','uncompensated','denials']},
 {id:'behavioral',label:'Therapist on video',short:'Therapist',kind:'THE THERAPIST ON A VIDEO CALL',
  headline:['Maya’s therapist bills a ','separate',' administrator with its own network and rules.'],
  lede:'Maya’s plan carves behavioral health out to an administrator with its own network, authorization rules and payer ID. Her therapist, licensed in her state and seeing her by video, checks eligibility and submits claims there. Many therapists stay outside networks; their patients pay directly and submit a superbill. Prescribing ADHD medication by telehealth has its own federal rules.',
  six:[
   ['What they want','To see patients and be paid a rate that supports a practice. Many solo clinicians skip insurance because credentialing, authorizations and low rates cost more than they return.'],
   ['Where the money goes','In network: the behavioral administrator pays the contracted rate for a timed psychotherapy code, plus cost sharing. Out of network: the patient pays the clinician and the plan may reimburse part.'],
   ['What hurts','Low network rates, parity that is promised on paper and hard to enforce, licensure for patients who move or travel, and prescribing rules that change year to year.'],
   ['Documents and systems','A small EHR or practice platform, a telehealth tool, the administrator’s portal, and increasingly an intermediary that credentials the clinician and bills for them.'],
   ['Words that shift','“Carve-out” means the benefit is administered elsewhere. “Place of service” says where the patient was (code 10 for home). “Parity” is a legal standard for the rules, with rates left to contracts.'],
   ['Where software helps','Credentialing and billing intermediaries, telehealth with claims built in, employer-purchased behavioral programs, measurement-based care, licensure and prescribing compliance.']
  ],
  builder:'The thinnest margin in the system sits here. The largest recent behavioral healthtech companies are intermediaries between clinicians and payers, or sell the benefit to employers.',
  sources:['carveout','parity','parityenforcement','pos','psychcodes','psypact','dea','oonbehavioral','intermediary','part2']},
 {id:'payer',label:'Payer',short:'Payer',kind:'THE PAYER',
  headline:['The payer is paid ','differently',' for each line of business, and runs a different operation for each.'],
  lede:'The insurer on Maya’s card runs several businesses under one brand. For Maya’s employer it administers claims for a fee. For a fully insured small employer it keeps premium and carries risk. For Medicare Advantage it is paid a risk-adjusted amount per member by CMS, and for managed Medicaid a capitation rate by a state. Each line has its own regulator, measures and often its own claims system.',
  six:[
   ['What they want','Premium or fees that cover claims plus administration, a medical loss ratio within the legal bounds, a network broad enough to sell and narrow enough to price, and quality scores that earn bonuses.'],
   ['Where the money goes','In: premium, administrative fees, capitation from CMS and states. Out: claims (the large majority), care management, the PBM, network contracting, member service and margin.'],
   ['What hurts','Cost trend it missed in pricing, risk scores it cannot defend, Star ratings that slip, and prior authorization under scrutiny: Medicare Advantage insurers made 52.8 million determinations in 2024, denied 7.7%, and lost 80.7% of the few appeals.'],
   ['Documents and systems','The policy or administrative services agreement, provider contracts, benefit configuration, the claims engine, utilization management, the member portal, regulatory filings.'],
   ['Words that shift','“Payer” covers any plan or claims counterparty; ask who bears risk, who adjudicates and who pays. “Plan” can be the company, the product or the employer’s arrangement. “Network” is a contract set.'],
   ['Where software helps','Claims adjudication and payment integrity, prior authorization and the new API obligations, provider data, risk adjustment and quality analytics, care management, member engagement, data exchange.']
  ],
  builder:'Name the line of business first. A capability for Medicare Advantage lives under different rules, data and incentives than the same capability for a self-funded employer account.',
  sources:['riskadj','stars','hedis','capitation','ratesetting','mlr','priorauthstats','api']}
];

export const incentives={
 lede:'Each party responds to how it is paid and what it is held accountable for. The behavior follows from the contracts.',
 items:[
  ['Why employers self-fund','Two thirds of covered workers are in self-funded plans. The employer keeps the premium margin an insurer would take, follows federal rules under ERISA in place of state benefit mandates, and sees its own claims data. Stop-loss insurance bounds the risk.','kff','stoploss'],
  ['Why payers manage utilization','An insurer that keeps the difference between premium and claims has a direct interest in avoiding care it judges unnecessary. The loss-ratio rules cap what it can keep, and prior authorization metrics are now public, which keeps the practice under scrutiny.','mlr','priorauthstats','api'],
  ['Why hospitals keep chargemasters','List prices anchor negotiations, apply to uninsured and out-of-network claims and feed cost reports. Price transparency rules now require hospitals to publish negotiated rates beside the list.','transparency','chargemaster'],
  ['Why practices consolidate','A larger group has leverage in contracting, can afford a revenue cycle team and can take on value-based contracts. Many practices now belong to hospitals, insurers or investors, which changes who sits across the table.','pfs','uhg'],
  ['Why PBMs like rebates','A PBM negotiates rebates from manufacturers against list price and keeps or passes through a share. High list prices produce large rebates, a structure the FTC examined in 2024.','ftcpbm'],
  ['Why clinicians leave networks','When the contracted rate for a timed therapy session falls below the clinician’s cost, the clinician goes out of network or cash-only. Parity law governs the rules; rates stay in the contracts.','parity','oonbehavioral']
 ]
};

export const shape={
 coverage:{headline:['Half of the country is covered through ','work',', and the rest through programs with their own rules.'],
  lede:'The route someone’s coverage takes decides the rules that apply, who pays and which products can reach them. Employer coverage is the largest route, then Medicare, Medicaid and individual policies. A person can hold more than one, so the shares add to more than 100%.',
  builder:'The same feature has a different buyer and regulator on each route. Choose the routes before the data model.',
  shares:[['Employment-based',53.5,'#20262c'],['Medicare',20.1,'#596169'],['Medicaid',17.1,'#8a9198'],['Direct purchase',10.5,'#b74220'],['TRICARE',2.8,'#c9ced3'],['VA and CHAMPVA',1.2,'#dfe2e5'],['Uninsured all year',7.9,'#fafbfc']],
  note:'Share of the US population with each coverage type for some or all of 2025. Census Bureau, September 2026. Categories overlap.',
  sources:['census','kff','ma','mco','marketplace']},
 history:{headline:['The system is a stack of ','decisions',', each still in force.'],
  lede:'Each layer solved a problem of its time and left a structure the next layer had to work around. These are the ones a builder still meets.',
  builder:'When a rule seems arbitrary, find its layer. Most of the system’s odd shapes come from a 1940s tax rule, a 1974 pension law or a 1996 privacy law meeting a 2024 API mandate.',
  layers:[
   ['1942–54','Employer coverage.','Wartime wage controls let firms compete on benefits, and a 1943 tax ruling, made uniform in the 1954 code, kept employer-paid premiums out of taxable income. Coverage attached itself to the job.','crs','treasury'],
   ['1965','Medicare and Medicaid.','Federal coverage for people over 65 and, with the states, for people with low incomes. Two programs, two rule sets, two of the largest payers.','cmshistory'],
   ['1973','The HMO Act.','Federal support for prepaid, managed plans: the origin of networks, gatekeeping and the plan types on today’s cards.','hmoact'],
   ['1974','ERISA.','Federal standards for private employer benefit plans, preempting state law. Why a self-funded plan escapes state insurance mandates and why the regulator depends on the funding arrangement.','erisa','stoploss'],
   ['1985','COBRA.','Continuation of employer coverage after a job ends, at the employee’s expense.','cobra'],
   ['1996','HIPAA.','Portability, privacy and security rules, and the standard electronic transactions every claim, eligibility check and remittance still uses.','hipaa101','standards'],
   ['2010','The Affordable Care Act.','Marketplaces, premium subsidies, Medicaid expansion, essential benefits, guaranteed issue and the medical loss ratio.','aca','mlr'],
   ['2022','The No Surprises Act.','Protection from out-of-network bills for emergency care and for out-of-network clinicians at in-network facilities, with a dispute process between providers and plans.','nsa'],
   ['2026–27','Interoperability and prior authorization APIs.','CMS-0057-F: decision timeframes and public metrics from 2026; patient, provider, payer-to-payer and prior authorization APIs from 2027 for the payers it covers.','api']
  ],
  sources:['crs','treasury','cmshistory','hmoact','erisa','cobra','hipaa101','aca','nsa','api']},
 money:{headline:['Premiums fill a pool, claims drain it, and the law bounds what ','stays',' behind.'],
  lede:'Contributions from employers, members, CMS and the states enter a pool. Claim payments to providers leave it. For insured products, at least 80 cents of each premium dollar (85 in the large-group market) must go to care and quality improvement, or the difference is rebated. The remainder covers administration and margin.',
  lede2:'In Maya’s self-funded plan the pool is the employer’s money, the administrator is paid a fee, and stop-loss insurance sits above it as a separate contract. The employer’s fiduciary duty under ERISA replaces the loss-ratio rule.',
  builder:'Every party’s behavior on the other pages comes from its position in this loop. Find where your product moves, saves or delays money in it, and you have found who will pay for it.',
  figures:[['$5.3T','US health spending in 2024, 18.0% of GDP','nhe'],['31%','paid by private insurance; Medicare 21%, Medicaid 18%, out of pocket 11%','nhe'],['80 / 85%','minimum share of premium for care and quality: individual and small group / large group','mlr'],['$1.6B','in loss-ratio rebates issued to members in 2025','mlrrebates']],
  sources:['nhe','mlr','mlrrebates','stoploss','erisa']}
};

// The claim walkthrough, one set of stage texts per encounter.
export const encounterSteps={
 therapy:{title:'Video therapy, January',summary:'A 50-minute psychotherapy session by video with an in-network therapist in Maya’s state.',
  steps:[
   {text:'The therapist’s billing intermediary checks eligibility with the behavioral administrator on the card. The response shows behavioral benefits, the deductible remaining and whether video visits are covered.',from:'Therapist (via intermediary)',to:'Behavioral administrator',artifact:'Eligibility inquiry + response',code:'270 → 271'},
   {text:'Routine outpatient psychotherapy rarely needs prior authorization under parity rules. An extended session or a testing battery can. The therapist checks the rules for the specific code.',from:'Therapist',to:'Behavioral administrator',artifact:'Authorization check',code:'278, where required'},
   {text:'The session takes place by video. The note records start and stop times because the psychotherapy code is timed, and the place of service is Maya’s home.',from:'Therapist',to:'Maya',artifact:'Session note',code:'Timed CPT code · POS 10 · modifier 95'},
   {text:'A professional claim goes to the behavioral administrator’s payer ID through the intermediary’s clearinghouse. The rendering provider is the therapist; the billing provider may be the intermediary’s group.',from:'Billing provider',to:'Clearinghouse → behavioral administrator',artifact:'Professional claim',code:'837P'},
   {text:'The administrator allows $120 against a $180 charge and applies Maya’s deductible. In January the whole $120 is hers. The $60 difference is the therapist’s contractual write-off.',from:'Behavioral administrator',to:'Claim decision',artifact:'Allowed $120 · member $120 · plan $0',code:'Benefit and contract rules'},
   {text:'The remittance explains the decision; the deductible absorbed the claim, so no plan money moves. Maya’s EOB says she owes $120, and the intermediary charges her card on file.',from:'Behavioral administrator',to:'Therapist + Maya',artifact:'Remittance · EOB · patient payment',code:'835 · patient billing'}
  ]},
 mri:{title:'Scheduled MRI, March',summary:'An MRI ordered by Maya’s doctor and scheduled at a hospital outpatient department. The hospital bills the facility claim; a radiologist bills the read.',
  steps:[
   {text:'The hospital’s scheduling team verifies eligibility and medical benefits with the medical administrator. Most of the $2,000 deductible remains, so the estimate will be high.',from:'Hospital scheduling',to:'Medical administrator',artifact:'Eligibility inquiry + response',code:'270 → 271'},
   {text:'Advanced imaging commonly requires prior authorization. The ordering office submits the clinical reason; the administrator, or a radiology benefit manager working for it, approves a date range. Approval leaves eligibility and claim rules still to be met.',from:'Ordering practice',to:'Administrator or review delegate',artifact:'Authorization request + decision',code:'278 / FHIR prior authorization API from 2027'},
   {text:'The scan happens in the outpatient department. The technologist and the machine belong to the hospital; the interpretation belongs to a radiologist who may work for a separate group.',from:'Hospital + radiologist',to:'Maya',artifact:'Imaging record + report',code:'Clinical workflow'},
   {text:'Two claims leave: the hospital’s institutional claim with a revenue code for the MRI and a $2,400 facility charge, and the radiologist’s professional claim for $600. Both carry the same date of service and the authorization number.',from:'Hospital + radiology group',to:'Clearinghouse → medical administrator',artifact:'Institutional claim + professional claim',code:'837I + 837P'},
   {text:'The administrator allows $750 on the facility claim and $250 on the professional claim: $1,000 against $3,000 billed. In March, Maya’s remaining deductible exceeds $1,000, so she owes all of it. Move the MRI to November and the split changes.',from:'Medical administrator',to:'Claim decisions',artifact:'Allowed $1,000 · member $1,000 · plan $0',code:'Benefit and contract rules'},
   {text:'Both providers receive remittances with the allowed amount, $2,000 of contractual adjustments between them and the patient responsibility. Maya receives two EOBs and, later, two bills.',from:'Medical administrator',to:'Hospital + radiologist + Maya',artifact:'Two remittances · two EOBs · two bills',code:'835 · patient billing'}
  ]},
 er:{title:'Emergency visit, September',summary:'Maya falls, goes to the nearest emergency department and is treated and released the same evening. The hospital is in network; the emergency physician group is out of network.',
  steps:[
   {text:'Emergency care begins before any eligibility check; the law and the plan’s rules require emergency services to be covered without prior approval. Registration captures the card after triage and runs eligibility then.',from:'Hospital registration',to:'Medical administrator',artifact:'Eligibility inquiry + response, after the fact',code:'270 → 271'},
   {text:'Prior authorization is waived for emergency care. Had Maya been admitted, the hospital would have notified the administrator and utilization review would have examined whether inpatient or observation status was justified.',from:'Hospital',to:'Medical administrator',artifact:'Admission notification, if admitted',code:'278 (notification), where required'},
   {text:'Maya is examined, imaged and treated by an emergency physician whose group contracts with the hospital and with none of Maya’s plan’s networks. The hospital’s facility services are in network.',from:'Hospital + emergency physician group',to:'Maya',artifact:'Emergency record',code:'Clinical workflow'},
   {text:'The hospital submits an institutional claim with emergency revenue codes and a level-of-care charge, $6,200 billed. The physician group submits a professional claim, $950 billed, as an out-of-network provider.',from:'Hospital + physician group',to:'Clearinghouse → medical administrator',artifact:'Institutional claim + out-of-network professional claim',code:'837I + 837P'},
   {text:'The administrator allows $2,200 on the facility claim at the contracted rate. For the out-of-network physician it sets a $400 allowed amount under the No Surprises Act, with Maya’s cost sharing calculated at in-network terms. Her deductible is met, so she owes 20%: $520 of $2,600.',from:'Medical administrator',to:'Claim decisions',artifact:'Allowed $2,600 · member $520 · plan $2,080',code:'Benefit rules · No Surprises Act'},
   {text:'The hospital receives its remittance and funds. The physician group receives the plan’s payment and may dispute the amount through the federal independent dispute resolution process; the law bars it from balance-billing Maya. She receives two EOBs and owes only her cost sharing.',from:'Medical administrator',to:'Hospital + physician group + Maya',artifact:'Remittances · funds · EOBs · possible IDR dispute',code:'835 + EFT · IDR'}
  ]}
};

export const seams={
 lede:'From enrollment to reconciliation there are nine seams where one party hands something to another. Each has a buyer, a measure the buyer watches, a data standard and a rule. Most healthcare software lives at one of them.',
 builder:'Pick a seam. Learn its standard, its rule and the number its buyer reports upward. Then decide whether you improve that number or replace the party on one side of it.',
 items:[
  {id:'enroll',label:'Enrollment and benefits administration',buyer:'Employers, their brokers and TPAs; Marketplaces and state agencies',measure:'Enrollment accuracy, time to card in hand, vendor file errors',standard:'X12 834 enrollment file; carrier EDI specifications',rule:'ERISA plan documents; ACA Marketplace rules; COBRA',text:'Open enrollment decisions become an enrollment file to each vendor: medical, behavioral, pharmacy, dental, vision. Errors here surface weeks later as a rejected eligibility check at a front desk.',sources:['enrollment','dol']},
  {id:'eligibility',label:'Eligibility and benefits',buyer:'Practices, hospitals, pharmacies, digital health companies',measure:'Verification rate before the visit, estimate accuracy, front-end denials',standard:'X12 270/271; clearinghouse and payer APIs',rule:'HIPAA transaction standards and operating rules',text:'Before care, the provider asks the administrator whether the member is covered today and what remains of the deductible. The response is the reliable basis for a cost estimate.',sources:['eligibility','standards']},
  {id:'auth',label:'Prior authorization',buyer:'Payers and their delegates; practices and hospitals on the other side',measure:'Turnaround time, approval rate, staff hours per request',standard:'X12 278; FHIR Prior Authorization API under CMS-0057-F',rule:'CMS-0057-F timeframes from 2026 and APIs from 2027 for covered payers; state laws; parity rules for behavioral care',text:'The most contested seam. Covered payers must publish their metrics and, from 2027, answer through an API. Software sells on both sides: automation for the payer, submission and tracking for the provider.',sources:['authorization','api','priorauthstats']},
  {id:'coding',label:'Documentation and coding',buyer:'Practices, hospitals, coding and billing vendors',measure:'Coding accuracy, documentation time, query rate',standard:'ICD-10-CM, CPT, HCPCS, revenue codes; EHR data',rule:'Coding guidelines; payer medical policies; fraud and abuse law',text:'The clinical note becomes codes, and codes become money. Ambient documentation and coding assistance are the current wave; the risk is a code the documentation fails to support.',sources:['icd','cpt','hcpcs']},
  {id:'claims',label:'Claims submission and clearinghouses',buyer:'Providers of every size; payers on the receiving end',measure:'First-pass acceptance, rejection rate, days to submit',standard:'X12 837P and 837I; NCPDP for pharmacy; 276/277 for status',rule:'HIPAA transaction standards; timely filing limits in each contract',text:'Clearinghouses validate, translate and route claims between thousands of providers and payers. When the largest one stopped in February 2024, payments across the country stopped with it.',sources:['claims','status','clearinghouse','uhgchange']},
  {id:'adjudication',label:'Adjudication and payment integrity',buyer:'Payers and administrators',measure:'Auto-adjudication rate, cost per claim, recovered overpayments',standard:'Payer benefit configuration; contract pricing; edits',rule:'Plan documents; provider contracts; state prompt-pay laws; fraud, waste and abuse programs',text:'The claim meets the benefit and the contract. Most claims pass without a human; the rest go to review. Payment integrity vendors look for duplicate, miscoded or unsupported claims before and after payment.',sources:['payment','dol']},
  {id:'remit',label:'Remittance and reconciliation',buyer:'Providers; their banks and revenue cycle vendors',measure:'Unapplied cash, reconciliation lag, adjustment reason accuracy',standard:'X12 835; EFT with reassociation trace',rule:'HIPAA transaction standards; operating rules for EFT and ERA',text:'The remittance explains the payment; the funds arrive separately. Matching the two and posting each adjustment reason to the right account is where provider finance teams spend their days.',sources:['payment']},
  {id:'patient',label:'Patient billing and payments',buyer:'Providers; employers through navigation benefits',measure:'Patient collection rate, days to pay, bad debt',standard:'Statements, estimates, payment plans; card and ACH rails',rule:'No Surprises Act good-faith estimates; state balance-billing laws; collection rules',text:'What remains after the plan pays is billed to the member. Estimates up front, clear statements and payment plans are the surface most patients ever see.',sources:['nsa','eob']},
  {id:'data',label:'Provider data, directories and interoperability',buyer:'Payers, providers, health information networks, regulators',measure:'Directory accuracy, API uptime, records exchanged',standard:'FHIR APIs (Patient Access, Provider Access, Payer-to-Payer); TEFCA; NPI and enrollment data',rule:'CMS interoperability rules; information blocking rules; HIPAA',text:'Who the providers are, which networks they belong to and which records can move between organizations. The newest seam, created by regulation, with the most infrastructure still to build.',sources:['api','tefca','npi']}
 ]
};

export const buyers={
 lede:'Each seat has a person who signs, a person who blocks and a calendar that decides when the signature can happen.',
 rows:[
  ['Employer','The benefits leader (HR or total rewards) with the CFO behind them. The broker or benefits consultant advises and often controls access; most employers use one.','Renewals and new vendors are decided in the months before the plan year, which for many employers begins January 1. Open enrollment runs in the weeks before it.'],
  ['Physician practice','The practice owner or administrator; in a larger group, the revenue cycle director or COO. Clinicians champion; administrators sign.','Short cycles, small budgets, high churn. Integration with the practice management system is the gate.'],
  ['Hospital','The VP of revenue cycle, the CFO or the CIO, depending on the seam. Clinical leaders sponsor; IT security and procurement review.','Long cycles tied to budget years and EHR roadmaps. A pilot in one department is the usual door.'],
  ['Therapist or virtual practice','The clinician, or the platform that employs or contracts them. Employer-purchased behavioral programs are bought by the benefits leader.','Fast for tools the clinician pays for; slow for anything that needs the administrator’s cooperation.'],
  ['Payer','Line-of-business leaders (commercial, Medicare, Medicaid), the chief medical officer for clinical programs, the CIO for platforms, procurement for everything.','Annual budgets, regulatory deadlines (the 2026 and 2027 API dates) and bid cycles for government contracts set the calendar.']
 ],
 calendar:[['Spring','Employers and brokers review renewal quotes and shop vendors for a calendar-year plan.'],['Summer','Benefit decisions are made; vendors contract for the next plan year.'],['Fall','Open enrollment: employer plans in the weeks before their plan year; Medicare October 15 to December 7; the Marketplace November 1 to January 15.'],['January 1','Marketplace coverage and many employer plan years begin; deductibles and out-of-pocket accumulators reset.']],
 builder:'Sell to the calendar. A product that reaches members through employers has one buying window a year, and the broker is usually in the room.',
 sources:['kff','medicareoep','marketplaceoep','broker','kffbroker']
};

export const privacy={
 lede:'Before any data moves, each party has a legal role. The roles decide what can be shared, with whom and under which agreement.',
 items:[
  ['Covered entity','Health plans, most providers and clearinghouses. Bound directly by the HIPAA privacy and security rules.','hipaaroles'],
  ['Business associate','A company that handles protected health information for a covered entity: a billing vendor, a cloud host, an analytics product. Bound by HIPAA and by an agreement with each customer.','hipaaroles'],
  ['The agreement','A business associate agreement states permitted uses, safeguards, breach duties and subcontractor flow-down. A product sold to covered entities signs one with every customer.','baa'],
  ['Minimum necessary','Use or disclose only the information the purpose needs, with exceptions that include disclosures for treatment. The rule shapes which fields an integration may request.','minimum'],
  ['De-identification','Two routes release data from the rules: removing eighteen identifiers (safe harbor) or an expert’s statistical determination. Both have conditions analytics products get wrong.','deid'],
  ['Substance use records','Records from federally assisted substance use programs follow 42 CFR Part 2, with consent requirements stricter than HIPAA. A 2024 rule aligned parts of it with HIPAA; the remaining differences matter for behavioral products.','part2'],
  ['State law','State privacy laws can be stricter than HIPAA, and several now cover consumer health data outside it. Check the state of the member as well as the state of the company.','hipaaroles']
 ],
 builder:'Decide your HIPAA role on day one. It determines your contracts, your architecture and which seams you can reach.',
 sources:['hipaaroles','baa','minimum','deid','part2']
};

export const organizations={
 lede:'One brand can hold several seats. Licensing, ownership, business portfolio and service contracts connect organizations in different ways, and each kind of connection carries a different meaning.',
 builder:'For a contract or an integration, identify the legal entity, the product and the line of business. The logo identifies the brand.',
 cards:[
  ['CVS Health','Aetna provides health benefits, CVS Caremark is the pharmacy benefit manager, and CVS owns pharmacies and clinics. One group holds the payer, the PBM and part of the provider seat.','cvs'],
  ['Centene','The largest Medicaid insurer, with 12.5 million Medicaid members in 30 states at the end of 2025, paid by states per member. It bought Magellan Health, a behavioral company, in 2022 and agreed to divest the remainder in December 2025. Portfolios change, so every relationship here carries a date.','centene'],
  ['Kaiser Permanente','An integrated system in which the health plan, the hospitals and the medical groups are parts of one organization. The payer and the provider share a seat, which changes every incentive on the other pages.','kaiser']
 ]
};

export const integration={
 lede:'Settle these with the organizations involved. They determine the contracts, data model, permissions and test cases a product needs.',
 items:[
  ['Identify each party','Record the sponsor, regulated entity, product, administrator, network, billing provider and payee separately. Use the trading partner’s current routing instructions. An NPI identifies a provider; the other roles need their own identifiers.'],
  ['Keep effective dates','Coverage, benefits, contracts and company relationships change. A claim’s service date can matter more than the date your system receives it. Retain the version used for a decision.'],
  ['Define states and reconciliation','Distinguish submission, acceptance, adjudication, payment, correction and appeal. Link remittance to funds, preserve identifiers, and agree how duplicates, reversals and adjustments are handled.'],
  ['Establish data access','Confirm the purpose and permission for each exchange, the parties’ HIPAA roles and the required agreements. Apply the minimum necessary standard where it applies; treatment disclosures are among its exceptions.']
 ],
 sources:['npi','identifiers','payment','clearinghouse','minimum']
};
