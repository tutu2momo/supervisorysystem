import React, { useState, useMemo, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { motion, AnimatePresence } from 'motion/react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area, ComposedChart
} from 'recharts';
import {
  LayoutDashboard, Activity, AlertTriangle, FileText, Users, Building2, ChevronDown, Bell, Search, Menu,
  CheckCircle2, Clock, Stethoscope, TrendingUp, MapPin, ShieldAlert, Wifi, WifiOff, UserCheck, ClipboardList,
  ChevronRight, ArrowLeft, Briefcase, Award, CircleDollarSign, BarChart3, LogOut, Network, FileBadge, X,
  Filter, ShieldCheck, Download, Eye, Star, User, Calendar, ArrowUpRight, ArrowDownRight, LayoutGrid,
  Monitor, HeartPulse, Brain, Microscope, Phone, Video, Share2, ThumbsUp, ThumbsDown, MessageSquareWarning,
  Timer, Frown, Meh, Smartphone, CreditCard, Wallet, ArrowRightLeft, PieChart as PieChartIcon, Landmark,
  Coins, Globe, Map, UserCog, Signal
} from 'lucide-react';

// --- Types & Mock Data ---

type ViewState = 'HOME' | 'INSTITUTION' | 'RESOURCE' | 'SERVICE' | 'OPERATION' | 'QUALITY' | 'FINANCE' | 'FINANCE_DETAIL';

// Roles
const ROLES = [
  { id: 'SUPER', name: '超级管理员' },
  { id: 'PROV', name: '省级监管平台' },
  { id: 'CITY', name: '市级监管平台' },
  { id: 'COUNTY', name: '县级监管平台' },
];

// Administrative Regions Hierarchy
const REGIONS = [
  { id: 'prov', name: '贵州省', type: 'Province', level: 1, children: ['贵阳市', '遵义市', '安顺市', '六盘水市', '毕节市'] },
  { id: 'gy', name: '贵阳市', type: 'City', level: 2, children: ['南明区', '云岩区', '观山湖区', '花溪区', '乌当区'] },
  { id: 'zy', name: '遵义市', type: 'City', level: 2, children: ['红花岗区', '汇川区', '播州区'] },
  { id: 'anshun', name: '安顺市', type: 'City', level: 2, children: ['西秀区', '平坝区'] },
  { id: 'nanming', name: '南明区', type: 'County', level: 3, children: ['新华路街道', '市府路街道', '中华南路街道', '油榨街道'] },
  { id: 'yunyan', name: '云岩区', type: 'County', level: 3, children: ['毓秀路街道', '威清门街道', '大营路街道'] },
];

// Unified Base Constants for Data Consistency
const BASE_DATA = {
  VOLUME: 4158230, // Month
  TODAY_VOLUME: 14520, // Today
  REVENUE_BILLION: 10.6,
  INSTITUTIONS: 342,
  INTERNET_HOSPITALS: 75,
  DOCTORS: 12450
};

// Mock Data Generator based on Region
const getDashboardData = (regionName: string) => {
  const regionObj = REGIONS.find(r => r.name === regionName) || REGIONS[0];
  const regionType = regionObj.type;
  
  let revenueLabel = '全区业务总量';
  if (regionType === 'Province') revenueLabel = '全省业务总量';
  else if (regionType === 'City') revenueLabel = '全市业务总量';

  let multiplier = 1;
  let rankingType = 'City'; 
  
  if (regionName === '贵州省') { multiplier = 1; rankingType = 'City'; }
  else if (regionName.includes('市')) { multiplier = 0.3; rankingType = 'County'; }
  else { multiplier = 0.05; rankingType = 'Hospital'; }

  const trendData = [
    { name: '周一', remote: Math.floor(100000 * multiplier), internet: Math.floor(240000 * multiplier) },
    { name: '周二', remote: Math.floor(95000 * multiplier), internet: Math.floor(210000 * multiplier) },
    { name: '周三', remote: Math.floor(110000 * multiplier), internet: Math.floor(260000 * multiplier) },
    { name: '周四', remote: Math.floor(105000 * multiplier), internet: Math.floor(250000 * multiplier) },
    { name: '周五', remote: Math.floor(120000 * multiplier), internet: Math.floor(280000 * multiplier) },
    { name: '周六', remote: Math.floor(80000 * multiplier), internet: Math.floor(190000 * multiplier) },
    { name: '周日', remote: Math.floor(75000 * multiplier), internet: Math.floor(180000 * multiplier) },
  ];

  let rankings = [];
  if (rankingType === 'City') {
    rankings = [
      { name: '贵阳市', value: 85 },
      { name: '遵义市', value: 72 },
      { name: '毕节市', value: 64 },
      { name: '六盘水', value: 58 },
      { name: '安顺市', value: 45 },
    ];
  } else if (rankingType === 'County') {
    rankings = [
      { name: regionObj.children?.[0] || '南明区', value: Math.floor(25 * (multiplier * 3)) },
      { name: regionObj.children?.[1] || '云岩区', value: Math.floor(22 * (multiplier * 3)) },
      { name: regionObj.children?.[2] || '观山湖区', value: Math.floor(19 * (multiplier * 3)) },
      { name: regionObj.children?.[3] || '花溪区', value: Math.floor(15 * (multiplier * 3)) },
      { name: '白云区', value: Math.floor(12 * (multiplier * 3)) },
    ];
  } else {
    rankings = [
      { name: '区人民医院', value: Math.floor(8 * (multiplier * 10)) },
      { name: '中医院', value: Math.floor(6 * (multiplier * 10)) },
      { name: '妇幼保健院', value: Math.floor(5 * (multiplier * 10)) },
      { name: '第一社区', value: Math.floor(3 * (multiplier * 10)) },
      { name: '第二社区', value: Math.floor(2 * (multiplier * 10)) },
    ];
  }

  return {
    kpi: {
      totalVolume: Math.floor(BASE_DATA.VOLUME * multiplier).toLocaleString(),
      todayVolume: Math.floor(BASE_DATA.TODAY_VOLUME * multiplier).toLocaleString(),
      institutions: Math.floor(1245 * multiplier),
      internetHospitals: Math.floor(BASE_DATA.INTERNET_HOSPITALS * multiplier), 
      networkedInst: Math.floor(BASE_DATA.INSTITUTIONS * multiplier),
      coverage: regionName === '贵州省' ? '99%' : '100%',
      revenue: (BASE_DATA.REVENUE_BILLION * multiplier).toFixed(2) + (multiplier < 0.1 ? '千万' : '亿'),
      revenueLabel: revenueLabel,
    },
    trend: trendData,
    rankings: rankings,
    rankingTitle: rankingType === 'City' ? '州市活跃度 (Top 5)' : (rankingType === 'County' ? '区县活跃度 (Top 5)' : '机构活跃度 (Top 5)')
  };
};

const MOCK_INSTITUTIONS = [
  {
    id: 1,
    name: '贵州省人民医院',
    level: '三级甲等',
    address: '贵阳市中山东路1号',
    deptCount: 45,
    status: '正常',
    licenses: ['医疗执业许可证', '放射诊疗许可证'],
    expiry: '2026-12-31',
    isLead: true,
    members: ['贵阳市第一人民医院', '南明区人民医院', '云岩区社区卫生服务中心'],
    leader: '张院长',
    phone: '0851-88888888',
    certCount: 3,
    violationCount: 0,
    depts: ['心血管内科', '神经外科', '远程医学中心', '呼吸与危重症医学科', '消化内科', '肾内科', '内分泌科', '血液内科']
  },
  {
    id: 2,
    name: '贵州医科大学附属医院',
    level: '三级甲等',
    address: '贵阳市贵医街28号',
    deptCount: 52,
    status: '正常',
    licenses: ['医疗执业许可证', '放射诊疗许可证'],
    expiry: '2026-12-31',
    isLead: true,
    members: ['贵阳市第二人民医院', '白云区医院'],
    leader: '李院长',
    phone: '0851-99999999',
    certCount: 3,
    violationCount: 0,
    depts: ['骨科', '神经内科', '康复医学科', '儿科', '妇产科', '眼科']
  },
  {
    id: 3,
    name: '贵州省肿瘤医院',
    level: '三级甲等',
    address: '贵阳市北京西路1号',
    deptCount: 28,
    status: '正常',
    licenses: ['医疗执业许可证'],
    expiry: '2026-12-31',
    isLead: true,
    members: ['花溪区人民医院', '乌当区人民医院'],
    leader: '王院长',
    phone: '0851-77777777',
    certCount: 1,
    violationCount: 0,
    depts: ['肿瘤内科', '放疗科', '胸外科', '头颈外科']
  }
];

const RESOURCE_MOCK = {
  doctors: {
    kpi: [
      { label: '注册医生总数', value: '12,450', unit: '人', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
      { label: '资质合格率', value: '100%', unit: '', icon: ShieldCheck, color: 'text-green-600', bg: 'bg-green-50' },
      { label: '高级职称占比', value: '64.7%', unit: '', icon: Award, color: 'text-purple-600', bg: 'bg-purple-50' },
      { label: '人均服务量', value: '334', unit: '次', icon: Activity, color: 'text-orange-600', bg: 'bg-orange-50' },
    ],
    titles: [
      { name: '主任医师', value: 3200 },
      { name: '副主任医师', value: 4800 },
      { name: '主治医师', value: 2450 },
      { name: '医师', value: 2000 },
    ],
    list: [
      { id: 1, name: '刘伟', title: '主任医师', dept: '心内科', hospital: '贵州省人民医院', volume: 1540, score: 4.9, status: '合规' },
      { id: 2, name: '张华', title: '主任医师', dept: '神经内科', hospital: '贵州省人民医院', volume: 1420, score: 4.8, status: '合规' },
      { id: 3, name: '李明', title: '副主任医师', dept: '呼吸科', hospital: '贵州省人民医院', volume: 1280, score: 4.9, status: '合规' },
      { id: 4, name: '赵丽', title: '副主任医师', dept: '内分泌', hospital: '贵州省人民医院', volume: 1150, score: 4.7, status: '合规' },
    ]
  },
  patients: {
    kpi: [
      { label: '总服务人次', value: '4,158,230', unit: '人次', icon: Network, color: 'text-purple-600', bg: 'bg-purple-50' },
      { label: '基层首诊率', value: '62.5%', unit: '', icon: ArrowUpRight, color: 'text-green-600', bg: 'bg-green-50' },
      { label: '平均住院日', value: 8.5, unit: '天', icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-50' },
      { label: '患者满意度', value: '98.2%', unit: '', icon: Star, color: 'text-orange-600', bg: 'bg-orange-50' },
    ],
    list: [
      { id: 1, name: '张*山', gender: '男', age: 45, diagnosis: '高血压 II级', hospital: '贵州省人民医院', dept: '心内科', date: '10-27 14:30', type: '慢病复诊', status: '已完成' },
      { id: 2, name: '李*梅', gender: '女', age: 32, diagnosis: '上呼吸道感染', hospital: '南明区人民医院', dept: '呼吸内科', date: '10-27 10:15', type: '在线问诊', status: '进行中' },
      { id: 3, name: '王*强', gender: '男', age: 67, diagnosis: '冠心病', hospital: '遵义医科大学附属医院', dept: '心外科', date: '10-26 16:20', type: '远程会诊', status: '待支付' },
      { id: 4, name: '赵*珍', gender: '女', age: 58, diagnosis: '2型糖尿病', hospital: '花溪区人民医院', dept: '内分泌科', date: '10-26 09:45', type: '慢病续方', status: '已完成' },
      { id: 5, name: '刘*华', gender: '男', age: 29, diagnosis: '急性肠胃炎', hospital: '云岩区第一人民医院', dept: '消化内科', date: '10-25 19:30', type: '门诊预约', status: '已取消' },
      { id: 6, name: '陈*芳', gender: '女', age: 41, diagnosis: '甲状腺结节', hospital: '贵州医科大学附属医院', dept: '甲乳外科', date: '10-25 11:00', type: '专家咨询', status: '已完成' },
    ]
  }
};

const SERVICE_MOCK = {
  kpi: [
    { label: '开通远程医疗机构数', value: '342', sub: '覆盖率 100%', icon: Network, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: '开通互联网医院数', value: '75', sub: '累计服务 300万+', icon: Wifi, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: '活跃注册医生', value: '8,500', sub: '本月活跃 > 60%', icon: UserCheck, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: '本月服务总量', value: '4,158,230', sub: '环比 +12.5%', icon: Activity, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  ],
  b2b: [
    { name: '远程会诊', inst: 240, doc: 1200 }, { name: '远程影像', inst: 300, doc: 800 },
    { name: '远程心电', inst: 320, doc: 600 }, { name: '远程病理', inst: 180, doc: 400 },
    { name: '远程重症监护', inst: 80, doc: 150 }, { name: '远程卒中', inst: 120, doc: 200 },
    { name: '远程超声示教', inst: 60, doc: 100 }, { name: '远程查房', inst: 150, doc: 300 },
  ],
  toc: [
    { name: '慢病复诊', inst: 70, doc: 5500 }, { name: '在线咨询', inst: 75, doc: 8000 },
    { name: '处方共享及配送', inst: 65, doc: 4000 }, { name: '公共卫生随访', inst: 300, doc: 2000 },
    { name: 'AI辅助诊疗', inst: 45, doc: 1500 }, { name: '报告解读', inst: 75, doc: 6000 },
  ],
  rankings: {
    b2b: [
      { name: '贵州省人民医院', value: 65890 }, { name: '贵州省肿瘤医院', value: 40600 },
      { name: '贵州医科大学附属医院', value: 29050 },
    ],
    toc: [
      { name: '贵州省人民医院', value: 391300 }, { name: '贵州医科大学附属医院', value: 339100 },
      { name: '贵州省肿瘤医院', value: 249800 },
    ]
  },
  hospitals: [
    { 
      id: 1, name: '贵州省人民医院', serviceCount: 9, doctorCount: 1240,
      b2bServices: ['远程会诊', '远程心电', '远程重症监护', '远程超声示教', '远程双向转诊', '远程手术示教', '远程检验质控', '远程康复指导'],
      tocServices: ['慢病复诊', '医学科普', '远程胎心监测', '居家护理预约', '健康档案查询'],
      deptDistribution: [
        { name: '神经内科', value: 15 }, { name: '心内科', value: 12 }, { name: '普外科', value: 10 },
        { name: '呼吸科', value: 8 }, { name: '儿科', value: 6 }, { name: '皮肤科', value: 4 }
      ]
    },
    { 
      id: 2, name: '贵州医科大学附属医院', serviceCount: 9, doctorCount: 980,
      b2bServices: ['远程会诊', '远程影像', '远程病理', '远程查房'],
      tocServices: ['在线咨询', '处方共享', 'AI辅助诊疗'],
      deptDistribution: [
        { name: '骨科', value: 18 }, { name: '消化科', value: 14 }, { name: '妇产科', value: 11 },
        { name: '眼科', value: 9 }, { name: '耳鼻喉', value: 7 }, { name: '口腔科', value: 5 }
      ]
    },
    { 
      id: 3, name: '贵州省肿瘤医院', serviceCount: 9, doctorCount: 650,
      b2bServices: ['远程会诊', '远程影像', '远程肿瘤MDT'],
      tocServices: ['随访管理', '康复指导'],
      deptDistribution: [
        { name: '肿瘤内科', value: 20 }, { name: '放疗科', value: 15 }, { name: '胸外科', value: 8 },
        { name: '影像科', value: 6 }, { name: '检验科', value: 4 }
      ]
    }
  ]
};

const OPERATION_MOCK = {
  kpi: {
    total: { value: '4,158,230', label: '区域业务总量', sub: '本月累计 (人次)' },
    remote: { value: '1,247,400', label: '远程医疗业务量', sub: '机构间协作 (H2H)' },
    internet: { value: '2,910,830', label: '互联网医疗业务量', sub: '面向患者 (ToC)' }
  },
  rankings: [
    { id: 1, name: '贵阳市', value: 1215000, unit: '人次' },
    { id: 2, name: '遵义市', value: 967000, unit: '人次' },
    { id: 3, name: '六盘水市', value: 726000, unit: '人次' },
    { id: 4, name: '安顺市', value: 503000, unit: '人次' },
  ],
  details: [
    { name: '贵阳市', remote: 365000, internet: 850000, total: 1215000, growth: 5.2, percent: 29.2 },
    { name: '遵义市', remote: 290000, internet: 677000, total: 967000, growth: 5.2, percent: 23.3 },
    { name: '六盘水市', remote: 218000, internet: 508000, total: 726000, growth: 4.8, percent: 17.5 },
    { name: '安顺市', remote: 151000, internet: 352000, total: 503000, growth: 4.5, percent: 12.1 },
  ],
  trend: [
    { name: '10-21', volume: 145000, growth: 12 },
    { name: '10-22', volume: 152000, growth: 15 },
    { name: '10-23', volume: 148000, growth: 8 },
    { name: '10-24', volume: 161000, growth: 18 },
    { name: '10-25', volume: 158000, growth: 14 },
    { name: '10-26', volume: 132000, growth: -5 },
    { name: '10-27', volume: 129000, growth: -8 },
  ]
};

const QUALITY_MOCK = {
  score: 4.85,
  positiveRate: 85,
  negativeRate: 2,
  sampleSize: 1500,
  stats: {
    positiveTotal: '3,534,495',
    negativeTotal: '83,164',
    videoPositiveRate: '98.6%'
  },
  regionalData: [
    { name: '贵阳市', positive: '1,032,750', negative: '24,300', rate: '98.3%', progress: 98 },
    { name: '遵义市', positive: '822,100', negative: '19,340', rate: '98.4%', progress: 98 },
    { name: '六盘水市', positive: '617,100', negative: '14,520', rate: '99.3%', progress: 99 },
    { name: '安顺市', positive: '427,550', negative: '10,060', rate: '99.2%', progress: 99 },
  ],
  rankings: {
    services: [
      { name: '远程病理诊断', score: 4.95 },
      { name: '远程影像诊断', score: 4.90 },
      { name: '专家视频问诊', score: 4.82 },
      { name: '慢病续方', score: 4.76 },
      { name: '远程心电分析', score: 4.65 },
    ],
    hospitals: [
      { name: '贵州省人民医院', score: 4.92 },
      { name: '贵州医科大学附属医院', score: 4.88 },
      { name: '贵州省肿瘤医院', score: 4.85 },
      { name: '贵阳市第一人民医院', score: 4.79 },
      { name: '遵义医科大学附属医院', score: 4.75 },
    ]
  },
  negativeReviews: [
    { tag: '候诊时间长', type: '远程专家会诊', content: '等待专家接诊时间超过30分钟，没有提前通知。', location: '南明区花果园社区卫生服务中心', date: '2023-10-27', score: 2, tagColor: 'bg-orange-100 text-orange-600' },
    { tag: '服务态度差', type: '互联网门诊', content: '医生回复非常敷衍，三句话就结束了问诊。', location: '贵州医科大学附属医院', date: '2023-10-26', score: 1, tagColor: 'bg-red-100 text-red-600' },
    { tag: '技术故障', type: '远程影像诊断', content: '系统卡顿严重，影像加载不出来。', location: '乌当区人民医院', date: '2023-10-25', score: 2, tagColor: 'bg-slate-100 text-slate-600' },
    { tag: '服务态度差', type: '慢病复诊', content: '医生未仔细询问病情就直接开药。', location: '遵义医科大学附属医院', date: '2023-10-24', score: 1, tagColor: 'bg-red-100 text-red-600' },
    { tag: '候诊时间长', type: '远程会诊', content: '连接超时多次，体验很差。', location: '六盘水市人民医院', date: '2023-10-23', score: 2, tagColor: 'bg-orange-100 text-orange-600' },
    { tag: '技术故障', type: '在线咨询', content: '视频画面卡顿，声音听不清楚。', location: '安顺市人民医院', date: '2023-10-22', score: 2, tagColor: 'bg-slate-100 text-slate-600' },
  ]
};

const FINANCE_MOCK = {
  kpi: {
    revenue: { 
      value: '1,006,720,000', 
      label: '全区总营收', 
      trend: '+12.5%', 
      trendType: 'up', 
      icon: CircleDollarSign, 
      color: 'text-blue-600', 
      bg: 'bg-blue-50',
      remoteValue: '402,688,000',
      internetValue: '604,032,000'
    },
    volume: { 
      value: '4,068,000', 
      label: '总服务单量', 
      trend: '+5.2%', 
      trendType: 'up', 
      icon: CreditCard, 
      color: 'text-emerald-600', 
      bg: 'bg-emerald-50',
      remoteValue: '1,220,400',
      internetValue: '2,847,600'
    },
    avgCost: { 
      value: '247', 
      label: '次均费用', 
      trend: '-1.2%', 
      trendType: 'down', 
      icon: Activity, 
      color: 'text-orange-600', 
      bg: 'bg-orange-50',
      remoteValue: '330',
      internetValue: '212'
    },
    institutions: { 
      value: '45', 
      label: '参与结算机构', 
      sub: '0 家医疗机构', 
      icon: Building2, 
      color: 'text-indigo-600', 
      bg: 'bg-indigo-50',
      remoteValue: '45',
      internetValue: '45'
    }
  },
  regionalAnalysis: [
    { name: '贵阳市', revenue: '¥276,848,000', volume: '39,834', remote: 40, internet: 60, remoteRev: '¥110,739,200', internetRev: '¥166,108,800' },
    { name: '遵义市', revenue: '¥276,848,000', volume: '39,834', remote: 30, internet: 70, remoteRev: '¥83,054,400', internetRev: '¥193,793,600' },
    { name: '六盘水市', revenue: '¥276,848,000', volume: '39,834', remote: 20, internet: 80, remoteRev: '¥55,369,600', internetRev: '¥221,478,400' },
    { name: '安顺市', revenue: '¥276,848,000', volume: '39,834', remote: 50, internet: 50, remoteRev: '¥138,424,000', internetRev: '¥138,424,000' },
  ],
  institutions: [
    { name: '贵州省人民医院', level: '三级甲等', address: '贵阳市中山东路1号', revenue: '¥570,146' },
    { name: '贵州医科大学附属医院', level: '三级甲等', address: '贵阳市贵医街28号', revenue: '¥492,893' },
    { name: '贵州省肿瘤医院', level: '三级甲等', address: '贵阳市北京西路1号', revenue: '¥262,973' },
  ],
  detail: {
    hospitalName: '贵州省人民医院',
    level: '三级甲等',
    revenue: '¥781,248',
    composition: { remote: 65, internet: 35 },
    costProfit: { human: 28, ops: 15, profit: 57 },
    settlement: { expense: '- ¥45,200', income: '+ ¥128,500' },
    services: [
      { name: '远程超声示教', tag: '远程医疗 (机构-机构)', type: '收入', count: 476, price: '¥346', total: '+¥164,696', percent: 21 },
      { name: '处方共享及配送', tag: '互联网医疗 (机构-患者)', type: '收入', count: 440, price: '¥342', total: '+¥150,480', percent: 19 },
      { name: '远程病理', tag: '远程医疗 (机构-机构)', type: '收入', count: 420, price: '¥262', total: '+¥110,040', percent: 14 },
      { name: '诊后随访', tag: '互联网医疗 (机构-患者)', type: '收入', count: 384, price: '¥258', total: '+¥99,072', percent: 13 },
      { name: '远程影像', tag: '远程医疗 (机构-机构)', type: '收入', count: 216, price: '¥306', total: '+¥66,096', percent: 8 },
      { name: '远程会诊', tag: '远程医疗 (机构-机构)', type: '支出', count: 364, price: '¥178', total: '-¥64,792', percent: 0 },
      { name: '远程查房', tag: '远程医疗 (机构-机构)', type: '收入', count: 328, price: '¥174', total: '+¥57,072', percent: 7 },
      { name: '远程探视', tag: '互联网医疗 (机构-患者)', type: '收入', count: 180, price: '¥302', total: '+¥54,360', percent: 7 },
      { name: '远程卒中', tag: '远程医疗 (机构-机构)', type: '收入', count: 124, price: '¥218', total: '+¥27,032', percent: 3 },
    ]
  }
};

const SubPageHeader = ({ title, onBack }: { title: string, onBack: () => void }) => (
  <div className="bg-white sticky top-0 z-50 border-b border-slate-100 px-4 h-14 flex items-center shadow-sm justify-between">
    <div className="flex items-center">
      <button onClick={onBack} className="p-2 -ml-2 text-slate-600 hover:bg-slate-50 rounded-full active:bg-slate-100 transition-colors">
        <ArrowLeft className="w-5 h-5" />
      </button>
      <h2 className="text-lg font-bold text-slate-800 ml-2">{title}</h2>
    </div>
    <div className="flex gap-3">
      <Bell className="w-5 h-5 text-slate-400" />
      <Menu className="w-5 h-5 text-slate-400" />
    </div>
  </div>
);

const FilterBar = ({ onFilterClick }: { onFilterClick?: () => void }) => (
  <div className="bg-white px-4 py-3 flex gap-3 border-b border-slate-50">
     <div className="flex-1 bg-slate-100 rounded-lg flex items-center px-3 py-2">
        <Search className="w-4 h-4 text-slate-400 mr-2" />
        <input type="text" placeholder="搜索区域/医院/科室..." className="bg-transparent text-xs w-full outline-none text-slate-600 placeholder:text-slate-400" />
     </div>
     <button onClick={onFilterClick} className="p-2 bg-slate-100 rounded-lg text-slate-500 active:bg-slate-200"><Filter className="w-4 h-4" /></button>
  </div>
);

const RegionSelectorModal = ({ isOpen, onClose, currentRegion, onRegionChange }: { isOpen: boolean, onClose: () => void, currentRegion: string, onRegionChange: (r: string) => void }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col justify-end">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      <div className="bg-white w-full rounded-t-3xl p-6 relative z-10 max-h-[80vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-slate-800">选择行政区域</h3>
          <button onClick={onClose} className="p-2 bg-slate-100 rounded-full text-slate-500"><X className="w-5 h-5" /></button>
        </div>
        <div className="overflow-y-auto space-y-4 flex-1 pb-safe">
          {REGIONS.map(province => (
            <div key={province.id} className="space-y-3">
              <div 
                className={`p-3 rounded-xl font-bold flex justify-between items-center ${currentRegion === province.name ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'bg-slate-50 text-slate-700'}`}
                onClick={() => { onRegionChange(province.name); onClose(); }}
              >
                {province.name}
                {currentRegion === province.name && <CheckCircle2 className="w-4 h-4" />}
              </div>
              <div className="grid grid-cols-3 gap-3 px-1">
                {province.children && province.children.map(city => (
                  <div 
                    key={city} 
                    className={`p-2 rounded-lg text-sm text-center border active:scale-95 transition-transform ${currentRegion === city ? 'bg-blue-50 text-blue-600 border-blue-200 font-bold' : 'bg-white text-slate-600 border-slate-100'}`}
                    onClick={() => { onRegionChange(city); onClose(); }}
                  >
                    {city}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const FilterModal = ({ isOpen, onClose, currentRegion, onRegionChange, currentHospital, onHospitalChange }: { isOpen: boolean, onClose: () => void, currentRegion: string, onRegionChange: (r: string) => void, currentHospital?: string, onHospitalChange?: (h: string) => void }) => {
  // Helper to find the city object for the current region
  const getCityForRegion = (region: string) => {
    // If region is a city (exists in REGIONS as type City)
    const cityObj = REGIONS.find(r => r.name === region && r.type === 'City');
    if (cityObj) return cityObj;

    // If region is a county, find its parent city
    const parentCity = REGIONS.find(r => r.type === 'City' && r.children?.includes(region));
    if (parentCity) return parentCity;

    return null;
  };

  const selectedCity = getCityForRegion(currentRegion);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/30 backdrop-blur-sm" 
            onClick={onClose}
          />
          <motion.div 
            key="drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 z-[101] w-[80%] max-w-sm bg-white p-6 overflow-y-auto shadow-2xl"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-slate-800">筛选条件</h3>
              <button onClick={onClose}><X className="w-6 h-6 text-slate-400" /></button>
            </div>
            
            <div className="mb-6">
              <h4 className="text-sm font-bold text-slate-700 mb-3">行政区域</h4>
              <div className="space-y-3">
                 <div 
                    className={`p-3 rounded-lg text-sm border text-center ${currentRegion === '贵州省' ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-slate-50 border-slate-100 text-slate-600'}`}
                    onClick={() => onRegionChange('贵州省')}
                 >
                    全省
                 </div>
                 <div className="grid grid-cols-2 gap-2">
                   {REGIONS[0].children?.map(city => (
                      <div 
                        key={city}
                        className={`p-3 rounded-lg text-sm border text-center ${currentRegion === city || (selectedCity && selectedCity.name === city) ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-slate-50 border-slate-100 text-slate-600'}`}
                        onClick={() => onRegionChange(city)}
                      >
                        {city}
                      </div>
                   ))}
                 </div>
              </div>

              {selectedCity && selectedCity.children && (
                <div className="mt-4 border-t border-slate-50 pt-4 animate-in fade-in slide-in-from-top-2">
                    <h4 className="text-sm font-bold text-slate-700 mb-3">{selectedCity.name} - 区县</h4>
                    <div className="grid grid-cols-2 gap-2">
                        {selectedCity.children.map(county => (
                            <div 
                                key={county}
                                className={`p-3 rounded-lg text-sm border text-center ${currentRegion === county ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-slate-50 border-slate-100 text-slate-600'}`}
                                onClick={() => onRegionChange(county)}
                            >
                                {county}
                            </div>
                        ))}
                    </div>
                </div>
              )}
            </div>

            {onHospitalChange && (
                <div className="mb-6">
                    <h4 className="text-sm font-bold text-slate-700 mb-3">医疗机构</h4>
                    <div className="space-y-2">
                        <div 
                            className={`p-3 rounded-lg text-sm border text-center ${!currentHospital || currentHospital === '全部医院' ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-slate-50 border-slate-100 text-slate-600'}`}
                            onClick={() => onHospitalChange('全部医院')}
                        >
                            全部医院
                        </div>
                        {MOCK_INSTITUTIONS.map(inst => (
                            <div 
                                key={inst.id}
                                className={`p-3 rounded-lg text-sm border text-center ${currentHospital === inst.name ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-slate-50 border-slate-100 text-slate-600'}`}
                                onClick={() => onHospitalChange(inst.name)}
                            >
                                {inst.name}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="mb-6">
               <h4 className="text-sm font-bold text-slate-700 mb-3">时间维度</h4>
               <div className="grid grid-cols-3 gap-2">
                  <div className="p-2 text-center rounded border bg-blue-50 border-blue-200 text-blue-600 text-xs">本月</div>
                  <div className="p-2 text-center rounded border bg-white border-slate-200 text-slate-600 text-xs">上月</div>
                  <div className="p-2 text-center rounded border bg-white border-slate-200 text-slate-600 text-xs">本年累计</div>
               </div>
            </div>

            <button onClick={onClose} className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold mt-4 shadow-lg shadow-blue-200">
               确定
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const FinanceHospitalDetailView = ({ hospital, onBack }: { hospital: any, onBack: () => void }) => {
  if (!hospital) return null;
  const data = FINANCE_MOCK.detail; 

  return (
    <div className="bg-slate-50 min-h-screen pb-12">
      <SubPageHeader title="财务构成分析" onBack={onBack} />
      <div className="bg-white p-4 border-b border-slate-100 flex justify-between items-center shadow-sm">
          <div>
             <h3 className="font-bold text-slate-800 text-lg">{hospital.name || data.hospitalName}</h3>
             <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                <span className="bg-slate-100 px-1.5 rounded">{hospital.level || data.level}</span>
             </div>
          </div>
        </div>

        <div className="p-4 space-y-4 flex-1">
           <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
              <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm min-w-[260px] flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-1.5 bg-blue-50 rounded text-blue-600"><PieChartIcon className="w-4 h-4" /></div>
                  <span className="text-xs font-bold text-slate-700">收入构成分析</span>
                </div>
                <div className="flex justify-between items-end mb-2">
                  <span className="text-xs text-slate-500">总营收</span>
                  <span className="text-lg font-bold text-slate-800">{hospital.revenue || data.revenue}</span>
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-[10px] mb-1">
                      <span className="text-slate-500">远程医疗 (H2H)</span>
                      <span className="text-slate-800 font-bold">{data.composition.remote}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: `${data.composition.remote}%` }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[10px] mb-1">
                      <span className="text-slate-500">互联网医疗 (ToC)</span>
                      <span className="text-slate-800 font-bold">{data.composition.internet}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${data.composition.internet}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm min-w-[260px] flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-1.5 bg-orange-50 rounded text-orange-600"><Wallet className="w-4 h-4" /></div>
                  <span className="text-xs font-bold text-slate-700">成本与利润概算</span>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div className="text-center">
                    <div className="text-lg font-bold text-slate-800">{data.costProfit.human}%</div>
                    <div className="text-[10px] text-slate-400">人力成本占比</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-slate-800">{data.costProfit.ops}%</div>
                    <div className="text-[10px] text-slate-400">设施运维占比</div>
                  </div>
                </div>
                <div className="bg-green-50 rounded-lg p-2 flex justify-between items-center">
                  <span className="text-[10px] text-green-700 font-bold">预估净利润率</span>
                  <span className="text-lg font-bold text-green-700">{data.costProfit.profit}%</span>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm min-w-[260px] flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-1.5 bg-purple-50 rounded text-purple-600"><Network className="w-4 h-4" /></div>
                  <span className="text-xs font-bold text-slate-700">协作网络结算</span>
                </div>
                <div className="space-y-2 mb-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-slate-500">上级转诊/会诊支出</span>
                    <span className="text-xs font-bold text-slate-800">{data.settlement.expense}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-slate-500">下级接收/指导收入</span>
                    <span className="text-xs font-bold text-green-600">{data.settlement.income}</span>
                  </div>
                </div>
                <div className="text-[10px] text-slate-400 border-t border-slate-50 pt-2 truncate">
                  主要往来: 贵州省人民医院, 乌当区人民医院
                </div>
              </div>
           </div>

           <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="p-4 border-b border-slate-50 flex items-center justify-between sticky top-0 bg-white z-10">
                <h3 className="font-bold text-slate-800 text-sm">业务收支明细报表</h3>
                <div className="flex gap-2">
                  <span className="text-[10px] px-2 py-0.5 bg-green-50 text-green-600 rounded border border-green-100">收入项</span>
                  <span className="text-[10px] px-2 py-0.5 bg-red-50 text-red-600 rounded border border-red-100">支出项</span>
                </div>
              </div>
              
              <div className="divide-y divide-slate-50">
                {data.services.map((item, idx) => (
                  <div key={idx} className="p-4 hover:bg-slate-50 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-bold text-slate-800 text-sm">{item.name}</div>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded border ${item.tag.includes('远程') ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                          {item.tag}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className={`font-bold text-sm ${item.type === '收入' ? 'text-green-600' : 'text-red-600'}`}>
                          {item.total}
                        </div>
                        <div className="text-[10px] text-slate-400">单价: {item.price}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                      <div className="flex items-center gap-1">
                        {item.type === '收入' ? <ArrowUpRight className="w-3 h-3 text-green-500" /> : <ArrowDownRight className="w-3 h-3 text-red-500" />}
                        <span>{item.type} | {item.count}次</span>
                      </div>
                      {item.percent > 0 && <span>占比 {item.percent}%</span>}
                    </div>

                    {item.percent > 0 && (
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden flex items-center">
                        <div className={`h-full rounded-full ${item.tag.includes('远程') ? 'bg-blue-500' : 'bg-emerald-500'}`} style={{ width: `${item.percent}%` }}></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
           </div>
        </div>
    </div>
  );
};

const DoctorQualificationModal = ({ isOpen, onClose, doctor }: { isOpen: boolean, onClose: () => void, doctor: any }) => {
  if (!isOpen || !doctor) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      <div className="bg-white w-full max-w-sm rounded-2xl p-6 relative z-10 shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-800">{doctor.name}</h3>
            <p className="text-sm text-slate-500">{doctor.hospital} - {doctor.dept}</p>
          </div>
          <button onClick={onClose} className="p-1 bg-slate-100 rounded-full text-slate-500"><X className="w-5 h-5" /></button>
        </div>
        
        <div className="space-y-4">
          <div className="flex gap-3 items-center p-3 bg-blue-50 rounded-xl border border-blue-100">
             <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-xl font-bold text-blue-600 shadow-sm">
                {doctor.name[0]}
             </div>
             <div>
                <div className="font-bold text-slate-800">{doctor.title}</div>
                <div className="text-xs text-slate-500">执业证书编码: 110520000012345</div>
             </div>
          </div>

          <div>
             <h4 className="text-sm font-bold text-slate-700 mb-2">资质证书</h4>
             <div className="grid grid-cols-2 gap-2">
                <div className="bg-slate-50 p-2 rounded border border-slate-100 text-center">
                   <FileBadge className="w-6 h-6 text-blue-500 mx-auto mb-1" />
                   <div className="text-[10px] text-slate-600">医师执业证书</div>
                </div>
                <div className="bg-slate-50 p-2 rounded border border-slate-100 text-center">
                   <Award className="w-6 h-6 text-orange-500 mx-auto mb-1" />
                   <div className="text-[10px] text-slate-600">职称资格证书</div>
                </div>
             </div>
          </div>

          <div>
             <h4 className="text-sm font-bold text-slate-700 mb-2">执业详情</h4>
             <div className="space-y-2 text-xs text-slate-600">
                <div className="flex justify-between border-b border-slate-50 pb-1">
                   <span>发证日期</span>
                   <span>2015-06-20</span>
                </div>
                <div className="flex justify-between border-b border-slate-50 pb-1">
                   <span>多点执业</span>
                   <span>是 (3家机构)</span>
                </div>
                <div className="flex justify-between border-b border-slate-50 pb-1">
                   <span>考核状态</span>
                   <span className="text-green-600 font-bold">{doctor.status}</span>
                </div>
             </div>
          </div>
          
          <button onClick={onClose} className="w-full py-2.5 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-200">
             关闭
          </button>
        </div>
      </div>
    </div>
  );
};

const ResourceRegulationView = ({ onBack, currentRegion, onRegionChange }: { onBack: () => void, currentRegion: string, onRegionChange: (r: string) => void }) => {
  const [activeTab, setActiveTab] = useState<'DOCTOR' | 'PATIENT'>('DOCTOR');
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentHospital, setCurrentHospital] = useState('全部医院');

  return (
    <div className="bg-slate-50 min-h-screen pb-12">
       <SubPageHeader title="资源监管" onBack={onBack} />
       <FilterBar onFilterClick={() => setIsFilterOpen(true)} />
       {(currentRegion !== '贵州省' || currentHospital !== '全部医院') && (
          <div className="bg-blue-50 px-4 py-2 flex items-center gap-2 flex-wrap text-xs border-b border-blue-100">
             <span className="text-slate-500">已选条件:</span>
             {currentRegion !== '贵州省' && (
                <div className="bg-white text-blue-600 px-2 py-1 rounded border border-blue-200 flex items-center gap-1">
                   {currentRegion}
                   <X className="w-3 h-3 cursor-pointer" onClick={() => onRegionChange('贵州省')} />
                </div>
             )}
             {currentHospital !== '全部医院' && (
                <div className="bg-white text-blue-600 px-2 py-1 rounded border border-blue-200 flex items-center gap-1">
                   {currentHospital}
                   <X className="w-3 h-3 cursor-pointer" onClick={() => setCurrentHospital('全部医院')} />
                </div>
             )}
          </div>
       )}
       <div className="sticky top-14 z-40 bg-white border-b border-slate-200 px-4 pt-2 shadow-sm">
          <div className="flex space-x-6">
            <button onClick={() => setActiveTab('DOCTOR')} className={`pb-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'DOCTOR' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500'}`}>医生资源</button>
            <button onClick={() => setActiveTab('PATIENT')} className={`pb-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'PATIENT' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500'}`}>患者分析</button>
          </div>
       </div>
       <div className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-3">
             {(activeTab === 'DOCTOR' ? RESOURCE_MOCK.doctors.kpi : RESOURCE_MOCK.patients.kpi).map((k, i) => (
                <div key={i} className="bg-white p-3 rounded-xl shadow-sm border border-slate-100 flex flex-col justify-between">
                   <div className="flex items-center gap-2 mb-2">
                      <div className={`p-1.5 rounded-lg ${k.bg} ${k.color}`}><k.icon className="w-4 h-4" /></div>
                      <span className="text-[10px] text-slate-500 truncate">{k.label}</span>
                   </div>
                   <div className="font-bold text-slate-800 text-lg">{k.value} <span className="text-xs text-slate-400 font-normal">{k.unit}</span></div>
                </div>
             ))}
          </div>
          {activeTab === 'DOCTOR' && (
             <>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                   <h3 className="font-bold text-slate-800 text-sm mb-3">医生职称分布</h3>
                   <div className="space-y-3">
                      {RESOURCE_MOCK.doctors.titles.map((t, idx) => (
                         <div key={idx} className="flex items-center gap-2">
                            <div className="w-20 text-xs text-slate-500">{t.name}</div>
                            <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                               <div className="h-full bg-blue-500" style={{ width: `${(t.value / 5000) * 100}%` }}></div>
                            </div>
                            <div className="w-10 text-xs font-bold text-slate-700 text-right">{t.value}</div>
                         </div>
                      ))}
                   </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                   <div className="p-4 border-b border-slate-50 flex justify-between items-center">
                      <h3 className="font-bold text-slate-800 text-sm">注册医生列表</h3>
                      <span className="text-xs text-slate-400">共 {RESOURCE_MOCK.doctors.list.length} 人</span>
                   </div>
                   <div className="divide-y divide-slate-50">
                      {RESOURCE_MOCK.doctors.list.map((doc) => (
                         <div key={doc.id} className="p-4 flex justify-between items-center hover:bg-slate-50 transition-colors">
                            <div className="flex items-center gap-3">
                               <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm">
                                  {doc.name[0]}
                               </div>
                               <div>
                                  <div className="flex items-center gap-2">
                                     <span className="font-bold text-slate-800 text-sm">{doc.name}</span>
                                     <span className="text-[10px] text-slate-500 bg-slate-100 px-1.5 rounded">{doc.title}</span>
                                  </div>
                                  <div className="text-xs text-slate-500 mt-0.5">{doc.hospital} · {doc.dept}</div>
                               </div>
                            </div>
                            <button 
                               onClick={() => setSelectedDoctor(doc)}
                               className="px-3 py-1.5 bg-white border border-blue-200 text-blue-600 rounded-full text-xs font-medium active:bg-blue-50"
                            >
                               查看资质
                            </button>
                         </div>
                      ))}
                   </div>
                </div>
             </>
          )}
          {activeTab === 'PATIENT' && (
             <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-4 border-b border-slate-50">
                   <h3 className="font-bold text-slate-800 text-sm">最新患者服务记录</h3>
                </div>
                <div className="divide-y divide-slate-50">
                   {RESOURCE_MOCK.patients.list.map((p, i) => (
                      <div key={i} className="p-4 flex justify-between items-center hover:bg-slate-50 transition-colors">
                         <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm ${p.gender === '男' ? 'bg-gradient-to-br from-blue-400 to-blue-600' : 'bg-gradient-to-br from-pink-400 to-pink-600'}`}>
                               {p.name.substring(0, 1)}
                            </div>
                            <div>
                               <div className="flex items-center gap-2 mb-0.5">
                                  <span className="font-bold text-slate-800 text-sm">{p.name}</span>
                                  <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 rounded">{p.gender} {p.age}岁</span>
                               </div>
                               <div className="text-xs text-slate-500 flex items-center gap-1">
                                  <span className="text-slate-700 font-medium">{p.diagnosis}</span>
                                  <span className="w-0.5 h-3 bg-slate-200"></span>
                                  <span className="truncate w-24">{p.hospital}</span>
                               </div>
                            </div>
                         </div>
                         <div className="text-right">
                            <div className="text-xs font-medium text-slate-600 mb-1">{p.type}</div>
                            <div className="flex justify-end gap-2 items-center">
                                <span className="text-[10px] text-slate-400">{p.date}</span>
                                <span className={`text-[10px] px-1.5 py-0.5 rounded border ${
                                   p.status === '已完成' ? 'bg-green-50 text-green-600 border-green-100' : 
                                   p.status === '进行中' ? 'bg-blue-50 text-blue-600 border-blue-100' : 
                                   p.status === '待支付' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                                   'bg-slate-100 text-slate-500 border-slate-200'
                                }`}>
                                   {p.status}
                                </span>
                            </div>
                         </div>
                      </div>
                   ))}
                </div>
             </div>
          )}
       </div>

       <DoctorQualificationModal 
          isOpen={!!selectedDoctor} 
          onClose={() => setSelectedDoctor(null)} 
          doctor={selectedDoctor} 
       />
       <FilterModal 
          isOpen={isFilterOpen} 
          onClose={() => setIsFilterOpen(false)} 
          currentRegion={currentRegion} 
          onRegionChange={onRegionChange} 
          currentHospital={currentHospital}
          onHospitalChange={setCurrentHospital}
       />
    </div>
  );
};

const QualityRegulationView = ({ onBack, currentRegion, onRegionChange }: { onBack: () => void, currentRegion: string, onRegionChange: (r: string) => void }) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <div className="bg-slate-50 min-h-screen pb-12">
       <SubPageHeader title="质量监管" onBack={onBack} />
       <FilterBar onFilterClick={() => setIsFilterOpen(true)} />
       {currentRegion !== '贵州省' && (
          <div className="bg-blue-50 px-4 py-2 flex items-center gap-2 flex-wrap text-xs border-b border-blue-100">
             <span className="text-slate-500">已选条件:</span>
             <div className="bg-white text-blue-600 px-2 py-1 rounded border border-blue-200 flex items-center gap-1">
                {currentRegion}
                <X className="w-3 h-3 cursor-pointer" onClick={() => onRegionChange('贵州省')} />
             </div>
          </div>
       )}
       <FilterModal 
         isOpen={isFilterOpen} 
         onClose={() => setIsFilterOpen(false)} 
         currentRegion={currentRegion} 
         onRegionChange={onRegionChange} 
       />
       <div className="p-4 space-y-4">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-6 text-white text-center shadow-lg">
             <div className="text-xs opacity-80 mb-2">全区医疗服务质量评分</div>
             <div className="text-4xl font-bold mb-2">{QUALITY_MOCK.score}</div>
             <div className="flex justify-center gap-4 text-xs opacity-90">
                <span>好评率 {QUALITY_MOCK.positiveRate}%</span>
                <span>差评率 {QUALITY_MOCK.negativeRate}%</span>
             </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
             <h3 className="font-bold text-slate-800 text-sm mb-3 flex items-center gap-2"><MessageSquareWarning className="w-4 h-4 text-red-500" /> 最新预警/差评</h3>
             <div className="space-y-3">
                {QUALITY_MOCK.negativeReviews.map((r, i) => (
                   <div key={i} className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                      <div className="flex justify-between items-start mb-2">
                         <span className={`text-[10px] px-1.5 py-0.5 rounded border ${r.tagColor.replace('text-', 'border-').replace('100', '200')} ${r.tagColor}`}>{r.tag}</span>
                         <span className="text-[10px] text-slate-400">{r.date}</span>
                      </div>
                      <div className="text-xs text-slate-700 mb-2 font-medium">{r.content}</div>
                      <div className="flex items-center gap-1 text-[10px] text-slate-400">
                         <MapPin className="w-3 h-3" /> {r.location}
                      </div>
                   </div>
                ))}
             </div>
          </div>
       </div>
    </div>
  );
};

const InstitutionRegulationView = ({ onBack, currentRegion, onRegionChange }: { onBack: () => void, currentRegion: string, onRegionChange: (r: string) => void }) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <div className="bg-slate-50 min-h-screen pb-12">
      <SubPageHeader title="机构监管" onBack={onBack} />
      <FilterBar onFilterClick={() => setIsFilterOpen(true)} />
      {currentRegion !== '贵州省' && (
          <div className="bg-blue-50 px-4 py-2 flex items-center gap-2 flex-wrap text-xs border-b border-blue-100">
             <span className="text-slate-500">已选条件:</span>
             <div className="bg-white text-blue-600 px-2 py-1 rounded border border-blue-200 flex items-center gap-1">
                {currentRegion}
                <X className="w-3 h-3 cursor-pointer" onClick={() => onRegionChange('贵州省')} />
             </div>
          </div>
       )}
      <FilterModal 
        isOpen={isFilterOpen} 
        onClose={() => setIsFilterOpen(false)} 
        currentRegion={currentRegion} 
        onRegionChange={onRegionChange} 
      />
      <div className="p-4 space-y-4">
        {/* Total Institutions Card */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl p-4 text-white shadow-lg flex justify-between items-center">
            <div>
                <div className="text-blue-100 text-sm mb-1">接入机构总数</div>
                <div className="text-3xl font-bold">{BASE_DATA.INSTITUTIONS}</div>
            </div>
            <Building2 className="w-12 h-12 text-blue-200 opacity-30" />
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-3 gap-3">
           <div className="bg-white p-3 rounded-xl border border-slate-100 text-center shadow-sm">
              <div className="text-xs text-slate-500 mb-1">三级医院</div>
              <div className="text-lg font-bold text-slate-800">12</div>
           </div>
           <div className="bg-white p-3 rounded-xl border border-slate-100 text-center shadow-sm">
              <div className="text-xs text-slate-500 mb-1">二级医院</div>
              <div className="text-lg font-bold text-slate-800">45</div>
           </div>
           {/* Updated Primary Hospital Card Style */}
           <div className="bg-white p-3 rounded-xl border border-slate-100 text-center shadow-sm">
              <div className="text-xs text-slate-500 mb-1">基层医院</div>
              <div className="text-lg font-bold text-slate-800">285</div>
           </div>
        </div>

        {MOCK_INSTITUTIONS.map((inst) => (
          <div key={inst.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-bold text-slate-800 text-base">{inst.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded border border-blue-100">{inst.level}</span>
                  <span className="text-[10px] px-1.5 py-0.5 bg-green-50 text-green-600 rounded border border-green-100">{inst.status}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-500">法人: {inst.leader}</div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2 my-3 text-xs text-slate-600">
               <div className="flex items-center gap-1"><MapPin className="w-3 h-3 text-slate-400" /> {inst.address}</div>
               <div className="flex items-center gap-1"><Phone className="w-3 h-3 text-slate-400" /> {inst.phone}</div>
            </div>

            <div className="bg-slate-50 rounded-lg p-3 space-y-2">
               <div className="flex justify-between text-xs">
                  <span className="text-slate-500">科室数量</span>
                  <span className="font-medium text-slate-800">{inst.deptCount} 个</span>
               </div>
               <div className="flex justify-between text-xs">
                  <span className="text-slate-500">资质证书</span>
                  <div className="flex gap-1">
                     {inst.licenses.slice(0, 2).map((l, i) => (
                        <span key={i} className="bg-white border border-slate-200 px-1 rounded text-[10px] text-slate-600">{l}</span>
                     ))}
                  </div>
               </div>
               {inst.isLead && (
                  <div className="pt-2 border-t border-slate-100 mt-2">
                     <div className="text-[10px] text-slate-400 mb-1">医联体成员 ({inst.members.length})</div>
                     <div className="flex flex-wrap gap-1">
                        {inst.members.map((m, i) => (
                           <span key={i} className="text-[10px] text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">{m}</span>
                        ))}
                     </div>
                  </div>
               )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ServiceRegulationView = ({ onBack, currentRegion, onRegionChange }: { onBack: () => void, currentRegion: string, onRegionChange: (r: string) => void }) => {
  const [activeTab, setActiveTab] = useState<'B2B' | 'TOC'>('B2B');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const chartData = activeTab === 'B2B' ? SERVICE_MOCK.b2b : SERVICE_MOCK.toc;
  const monthlyVolume = activeTab === 'B2B' ? OPERATION_MOCK.kpi.remote.value : OPERATION_MOCK.kpi.internet.value;
  const volumeLabel = activeTab === 'B2B' ? '本月远程医疗服务总量' : '本月互联网医疗服务总量';
  const themeColor = activeTab === 'B2B' ? 'text-blue-600' : 'text-emerald-600';
  const barColor = activeTab === 'B2B' ? '#3b82f6' : '#10b981';
  const progressColor = activeTab === 'B2B' ? 'bg-blue-500' : 'bg-emerald-500';

  return (
    <div className="bg-slate-50 min-h-screen pb-12">
      <SubPageHeader title="业务监管" onBack={onBack} />
      <FilterBar onFilterClick={() => setIsFilterOpen(true)} />
      {currentRegion !== '贵州省' && (
          <div className="bg-blue-50 px-4 py-2 flex items-center gap-2 flex-wrap text-xs border-b border-blue-100">
             <span className="text-slate-500">已选条件:</span>
             <div className="bg-white text-blue-600 px-2 py-1 rounded border border-blue-200 flex items-center gap-1">
                {currentRegion}
                <X className="w-3 h-3 cursor-pointer" onClick={() => onRegionChange('贵州省')} />
             </div>
          </div>
       )}
      <FilterModal 
        isOpen={isFilterOpen} 
        onClose={() => setIsFilterOpen(false)} 
        currentRegion={currentRegion} 
        onRegionChange={onRegionChange} 
      />
      
      <div className="p-4 grid grid-cols-2 gap-3 bg-white mb-2">
         {SERVICE_MOCK.kpi.map((k, i) => (
            <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-100">
               <div className="flex items-center gap-2 mb-1">
                  <k.icon className={`w-4 h-4 ${k.color}`} />
                  <span className="text-xs text-slate-500">{k.label}</span>
               </div>
               <div className="text-lg font-bold text-slate-800">{k.value}</div>
               <div className="text-xs text-slate-400">{k.sub}</div>
            </div>
         ))}
      </div>

      <div className="bg-white sticky top-14 z-40 border-b border-slate-100 px-4">
         <div className="flex space-x-6">
            <button onClick={() => setActiveTab('B2B')} className={`py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'B2B' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500'}`}>远程医疗 (H2H)</button>
            <button onClick={() => setActiveTab('TOC')} className={`py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'TOC' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-slate-500'}`}>互联网医疗 (ToC)</button>
         </div>
      </div>

      <div className="p-4 space-y-4">
         {/* Added Volume Card for each tab */}
         <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex justify-between items-center">
             <div>
                 <div className="text-xs text-slate-500 mb-1">{volumeLabel}</div>
                 <div className="text-2xl font-bold text-slate-800">{monthlyVolume}</div>
             </div>
             <div className={`w-10 h-10 ${activeTab === 'B2B' ? 'bg-blue-50' : 'bg-emerald-50'} rounded-full flex items-center justify-center`}>
                 <Activity className={`w-5 h-5 ${themeColor}`} />
             </div>
         </div>

         <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
            <h3 className="font-bold text-slate-800 text-sm mb-4">业务类型分布</h3>
            <div className="h-64 w-full">
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                     <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                     <XAxis type="number" hide />
                     <YAxis dataKey="name" type="category" width={80} tick={{fontSize: 10, fill: '#64748b'}} />
                     <RechartsTooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                     <Bar dataKey="doc" name="服务人次" fill={barColor} radius={[0, 4, 4, 0]} barSize={20} />
                  </BarChart>
               </ResponsiveContainer>
            </div>
         </div>

         <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
            <h3 className="font-bold text-slate-800 text-sm mb-3">重点医院排名</h3>
            <div className="space-y-3">
               {(activeTab === 'B2B' ? SERVICE_MOCK.rankings.b2b : SERVICE_MOCK.rankings.toc).map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                     <div className={`w-5 h-5 rounded flex items-center justify-center text-xs font-bold ${idx < 3 ? (activeTab === 'B2B' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700') : 'bg-slate-100 text-slate-500'}`}>
                        {idx + 1}
                     </div>
                     <div className="flex-1">
                        <div className="flex justify-between text-xs mb-1">
                           <span className="text-slate-700 font-medium">{item.name}</span>
                           <span className="text-slate-900 font-bold">{item.value.toLocaleString()}</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                           <div className={`h-full ${progressColor} rounded-full`} style={{ width: `${(item.value / (activeTab === 'B2B' ? 70000 : 400000)) * 100}%` }}></div>
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
};

const OperationRegulationView = ({ onBack, currentRegion, onRegionChange }: { onBack: () => void, currentRegion: string, onRegionChange: (r: string) => void }) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <div className="bg-slate-50 min-h-screen pb-12">
      <SubPageHeader title="运行监管" onBack={onBack} />
      <FilterBar onFilterClick={() => setIsFilterOpen(true)} />
      {currentRegion !== '贵州省' && (
          <div className="bg-blue-50 px-4 py-2 flex items-center gap-2 flex-wrap text-xs border-b border-blue-100">
             <span className="text-slate-500">已选条件:</span>
             <div className="bg-white text-blue-600 px-2 py-1 rounded border border-blue-200 flex items-center gap-1">
                {currentRegion}
                <X className="w-3 h-3 cursor-pointer" onClick={() => onRegionChange('贵州省')} />
             </div>
          </div>
       )}
      <FilterModal 
        isOpen={isFilterOpen} 
        onClose={() => setIsFilterOpen(false)} 
        currentRegion={currentRegion} 
        onRegionChange={onRegionChange} 
      />
      
      <div className="p-4 space-y-4">
         {/* Top KPI */}
         <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
            <div className="text-center mb-4">
               <div className="text-sm text-slate-500">{OPERATION_MOCK.kpi.total.label}</div>
               <div className="text-3xl font-bold text-slate-800 mt-1">{OPERATION_MOCK.kpi.total.value}</div>
               <div className="text-xs text-slate-400 mt-1">{OPERATION_MOCK.kpi.total.sub}</div>
            </div>
            <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-4">
               <div className="text-center border-r border-slate-100">
                  <div className="text-lg font-bold text-blue-600">{OPERATION_MOCK.kpi.remote.value}</div>
                  <div className="text-xs text-slate-500 mt-1">{OPERATION_MOCK.kpi.remote.label}</div>
               </div>
               <div className="text-center">
                  <div className="text-lg font-bold text-green-600">{OPERATION_MOCK.kpi.internet.value}</div>
                  <div className="text-xs text-slate-500 mt-1">{OPERATION_MOCK.kpi.internet.label}</div>
               </div>
            </div>
         </div>

         {/* Chart Section - Optimized Drill Down */}
         <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-4">
               <h3 className="font-bold text-slate-800 text-sm">业务量趋势分析</h3>
               <div className="flex gap-2 text-[10px]">
                  <span className="flex items-center gap-1 text-slate-500"><div className="w-2 h-2 rounded bg-blue-500"></div>总量</span>
                  <span className="flex items-center gap-1 text-slate-500"><div className="w-2 h-1 bg-red-500"></div>环比%</span>
               </div>
            </div>
            <div className="h-56 w-full">
               <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={OPERATION_MOCK.trend}>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                     <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} />
                     <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} />
                     <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} unit="%" />
                     <RechartsTooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                     <Bar yAxisId="left" dataKey="volume" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={12} name="业务总量" />
                     <Line yAxisId="right" type="monotone" dataKey="growth" stroke="#ef4444" strokeWidth={2} dot={{r: 3}} name="环比增长" />
                  </ComposedChart>
               </ResponsiveContainer>
            </div>
         </div>

         {/* Detailed List */}
         <div className="space-y-3">
            <h3 className="font-bold text-slate-800 text-sm ml-1">各区域运行详情</h3>
            {OPERATION_MOCK.details.map((d, i) => (
               <div key={i} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                  <div className="flex justify-between items-center mb-3">
                     <span className="font-bold text-slate-800 flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-xs font-bold">{i+1}</div>
                        {d.name}
                     </span>
                     <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded flex items-center">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        {d.growth}%
                     </span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 mb-3">
                     <div className="bg-slate-50 p-2 rounded-lg text-center">
                        <div className="text-[10px] text-slate-400">总业务量</div>
                        <div className="text-sm font-bold text-slate-700">{d.total.toLocaleString()}</div>
                     </div>
                     <div className="bg-blue-50 p-2 rounded-lg text-center">
                        <div className="text-[10px] text-blue-400">远程医疗</div>
                        <div className="text-sm font-bold text-blue-700">{d.remote.toLocaleString()}</div>
                     </div>
                     <div className="bg-green-50 p-2 rounded-lg text-center">
                        <div className="text-[10px] text-green-400">互联网医疗</div>
                        <div className="text-sm font-bold text-green-700">{d.internet.toLocaleString()}</div>
                     </div>
                  </div>

                  <div className="text-xs text-slate-500 mb-1 flex justify-between">
                     <span>业务结构占比</span>
                     <span className="text-slate-400">远程 vs 互医</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden flex relative">
                     <div className="h-full bg-blue-500" style={{ width: `${(d.remote / d.total) * 100}%` }}></div>
                     <div className="h-full bg-green-500" style={{ width: `${(d.internet / d.total) * 100}%` }}></div>
                     {/* Separator line for clarity */}
                     <div className="absolute top-0 bottom-0 w-0.5 bg-white" style={{ left: `${(d.remote / d.total) * 100}%` }}></div>
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                     <span className="text-blue-500 font-medium">{Math.round((d.remote / d.total) * 100)}%</span>
                     <span className="text-green-500 font-medium">{Math.round((d.internet / d.total) * 100)}%</span>
                  </div>
               </div>
            ))}
         </div>
      </div>
    </div>
  );
};

const FinanceRegulationView = ({ onBack, currentRegion, onRegionChange, onViewDetail }: { onBack: () => void, currentRegion: string, onRegionChange: (r: string) => void, onViewDetail: (hospital: any) => void }) => {
   const [isFilterOpen, setIsFilterOpen] = useState(false);

   return (
    <div className="bg-slate-50 min-h-screen pb-12">
      <SubPageHeader title="财务监管" onBack={onBack} />
      <FilterBar onFilterClick={() => setIsFilterOpen(true)} />
      {currentRegion !== '贵州省' && (
          <div className="bg-blue-50 px-4 py-2 flex items-center gap-2 flex-wrap text-xs border-b border-blue-100">
             <span className="text-slate-500">已选条件:</span>
             <div className="bg-white text-blue-600 px-2 py-1 rounded border border-blue-200 flex items-center gap-1">
                {currentRegion}
                <X className="w-3 h-3 cursor-pointer" onClick={() => onRegionChange('贵州省')} />
             </div>
          </div>
       )}
      <FilterModal 
        isOpen={isFilterOpen} 
        onClose={() => setIsFilterOpen(false)} 
        currentRegion={currentRegion} 
        onRegionChange={onRegionChange} 
      />
      
      <div className="p-4 space-y-4">
         <div className="grid grid-cols-2 gap-3">
            {Object.values(FINANCE_MOCK.kpi).map((k: any, i) => (
               <div key={i} className="bg-white p-3 rounded-xl shadow-sm border border-slate-100">
                  <div className="flex justify-between items-start mb-2">
                     <div className={`p-1.5 rounded-lg ${k.bg} ${k.color}`}><k.icon className="w-4 h-4" /></div>
                     {k.trend && (
                        <span className={`text-[10px] flex items-center ${k.trendType === 'up' ? 'text-red-500' : 'text-green-500'}`}>
                           {k.trendType === 'up' ? <TrendingUp className="w-3 h-3 mr-0.5" /> : <ArrowDownRight className="w-3 h-3 mr-0.5" />}
                           {k.trend}
                        </span>
                     )}
                  </div>
                  <div className="text-sm font-bold text-slate-800 mb-0.5 break-all">{k.value}</div>
                  <div className="text-[10px] text-slate-500">{k.label}</div>
               </div>
            ))}
         </div>

         <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-4">
               <h3 className="font-bold text-slate-800 text-sm">区域收支分析</h3>
               {/* Removed View Report Button */}
            </div>
            
            <div className="overflow-x-auto">
               <table className="w-full text-left border-collapse">
                  <thead>
                     <tr>
                        <th className="pb-2 text-xs text-slate-400 font-normal pl-1">区域</th>
                        <th className="pb-2 text-xs text-slate-400 font-normal">总营收</th>
                        <th className="pb-2 text-xs text-slate-400 font-normal text-right pr-1">结构(远/互)</th>
                     </tr>
                  </thead>
                  <tbody className="text-xs">
                     {FINANCE_MOCK.regionalAnalysis.map((r, i) => (
                        <tr key={i} className="border-t border-slate-50 hover:bg-slate-50">
                           <td className="py-3 font-medium text-slate-700 pl-1">{r.name}</td>
                           <td className="py-3 text-slate-600 font-mono">{r.revenue}</td>
                           <td className="py-3 text-right pr-1">
                              <div className="flex items-center justify-end gap-1">
                                 <span className="text-blue-500">{r.remote}%</span>
                                 <span className="text-slate-300">/</span>
                                 <span className="text-green-500">{r.internet}%</span>
                              </div>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>

         <div className="space-y-3">
            <h3 className="font-bold text-slate-800 text-sm ml-1">重点机构财务概览</h3>
            <div className="grid grid-cols-3 gap-2">
               {FINANCE_MOCK.institutions.map((inst, i) => (
                  <div key={i} className="bg-white p-3 rounded-xl shadow-sm border border-slate-100 active:scale-[0.98] transition-transform cursor-pointer flex flex-col justify-between h-full" onClick={() => onViewDetail(inst)}>
                     <div>
                        <div className="font-bold text-slate-800 text-xs mb-1 line-clamp-2 h-8">{inst.name}</div>
                        <div className="flex flex-wrap gap-1 mb-2">
                           <span className="bg-slate-100 px-1 py-0.5 rounded text-[10px] text-slate-500 scale-90 origin-left whitespace-nowrap">{inst.level}</span>
                        </div>
                     </div>
                     <div className="pt-2 border-t border-slate-50">
                        <div className="text-[10px] text-slate-400 mb-0.5 scale-90 origin-left">本月营收</div>
                        <div className="text-sm font-bold text-slate-800 font-mono">{inst.revenue}</div>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </div>
    </div>
   );
};

const HeaderProfile = ({ currentRegion, onRegionChange }: { currentRegion: string, onRegionChange: (r: string) => void }) => {
  const [isRegionModalOpen, setIsRegionModalOpen] = useState(false);
  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false);
  const [currentRole, setCurrentRole] = useState(ROLES[0]);

  return (
    <div className="bg-blue-600 text-white p-4 pb-8 rounded-b-[1.5rem] shadow-lg relative z-30 transition-all duration-300">
        <div className="absolute inset-0 overflow-hidden rounded-b-[1.5rem] pointer-events-none">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-6 -mt-6 blur-2xl"></div>
        </div>
        <div className="flex justify-between items-center mb-4 relative z-10">
            <div className="flex items-center gap-2 cursor-pointer active:opacity-80 transition-opacity" onClick={() => setIsRegionModalOpen(true)}>
                <MapPin className="w-5 h-5 text-blue-200" />
                <span className="font-bold text-lg">{currentRegion}</span>
                <ChevronDown className="w-4 h-4 text-blue-200" />
            </div>
            <div className="flex gap-3">
                <button className="relative p-2 bg-blue-500/30 rounded-full hover:bg-blue-500/50 transition-colors">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-400 rounded-full border border-blue-600"></span>
                </button>
                <div className="relative">
                   <div 
                      className="w-9 h-9 bg-white/20 rounded-full border-2 border-white/30 overflow-hidden cursor-pointer"
                      onClick={() => setIsRoleMenuOpen(!isRoleMenuOpen)}
                   >
                      <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" alt="User" />
                   </div>
                   
                   {isRoleMenuOpen && (
                      <>
                         <div className="fixed inset-0 z-40" onClick={() => setIsRoleMenuOpen(false)}></div>
                         <div className="absolute right-0 top-full mt-2 w-40 bg-white rounded-xl shadow-xl overflow-hidden text-slate-800 z-50 animate-in fade-in zoom-in-95 duration-200">
                            <div className="px-4 py-2 bg-slate-50 border-b border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-wider">切换身份</div>
                            {ROLES.map(role => (
                               <button
                                  key={role.id}
                                  className={`w-full text-left px-4 py-2.5 text-xs font-medium hover:bg-blue-50 hover:text-blue-600 transition-colors flex items-center justify-between ${currentRole.id === role.id ? 'text-blue-600 bg-blue-50' : ''}`}
                                  onClick={() => { setCurrentRole(role); setIsRoleMenuOpen(false); }}
                               >
                                  {role.name}
                                  {currentRole.id === role.id && <CheckCircle2 className="w-3.5 h-3.5" />}
                               </button>
                            ))}
                            <a 
                               href="https://tutu2momo.github.com/supervisorysystem" 
                               target="_blank" 
                               rel="noopener noreferrer"
                               className="w-full text-left px-4 py-2.5 text-xs font-medium hover:bg-blue-50 hover:text-blue-600 transition-colors flex items-center justify-between text-slate-500 border-t border-slate-50"
                            >
                               项目主页
                               <Globe className="w-3.5 h-3.5" />
                            </a>
                         </div>
                      </>
                   )}
                </div>
            </div>
        </div>
        
        <RegionSelectorModal 
          isOpen={isRegionModalOpen} 
          onClose={() => setIsRegionModalOpen(false)} 
          currentRegion={currentRegion} 
          onRegionChange={onRegionChange} 
        />

        <div className="relative z-10">
            <h1 className="text-xl font-bold mb-1">下午好, 管理员</h1>
            <p className="text-blue-100 text-xs opacity-80 flex items-center gap-1">
               <UserCog className="w-3 h-3" /> 当前身份: {currentRole.name}
            </p>
        </div>
    </div>
  );
};

const QuickAccessGrid = ({ onNavigate }: { onNavigate: (view: ViewState) => void }) => {
  const menuItems = [
    { id: 'INSTITUTION', label: '机构监管', icon: Building2, color: 'text-blue-600', bg: 'bg-blue-50' },
    { id: 'RESOURCE', label: '资源监管', icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
    { id: 'SERVICE', label: '业务监管', icon: Activity, color: 'text-green-600', bg: 'bg-green-50' },
    { id: 'OPERATION', label: '运行监管', icon: BarChart3, color: 'text-orange-600', bg: 'bg-orange-50' },
    { id: 'QUALITY', label: '质量监管', icon: ShieldCheck, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { id: 'FINANCE', label: '财务监管', icon: CircleDollarSign, color: 'text-rose-600', bg: 'bg-rose-50' },
  ];

  return (
    <div className="grid grid-cols-3 gap-3 px-4 -mt-6 relative z-20 mb-4">
       {menuItems.map(item => (
          <div 
             key={item.id} 
             onClick={() => onNavigate(item.id as ViewState)}
             className="bg-white p-3 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center justify-center gap-2 active:scale-95 transition-transform cursor-pointer h-24"
          >
             <div className={`p-2 rounded-full ${item.bg} ${item.color}`}>
                <item.icon className="w-5 h-5" />
             </div>
             <span className="text-xs font-medium text-slate-600">{item.label}</span>
          </div>
       ))}
    </div>
  );
};

const HomeView = ({ onNavigate, data }: { onNavigate: (view: ViewState) => void, data: any }) => {
  return (
    <div className="pb-24">
       <QuickAccessGrid onNavigate={onNavigate} />
       
       <div className="px-4 space-y-4">
          {/* Main KPI Cards (Today & Internet Hospitals) - Visual Enhanced */}
          <div className="grid grid-cols-2 gap-3">
             <div 
               className="bg-gradient-to-br from-blue-500 to-indigo-600 p-4 rounded-2xl shadow-lg shadow-blue-200 relative overflow-hidden text-white cursor-pointer active:scale-95 transition-transform"
               onClick={() => onNavigate('OPERATION')}
             >
                <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
                <Activity className="absolute -right-2 -bottom-2 w-16 h-16 text-white/10 rotate-12" />
                
                <div className="relative z-10">
                   <div className="flex items-center gap-1.5 text-blue-100 text-xs font-medium mb-2">
                      <div className="w-1.5 h-1.5 bg-blue-200 rounded-full"></div> 今日业务总量
                   </div>
                   <div className="text-2xl font-bold tracking-tight mb-2">{data.kpi.todayVolume}</div>
                   <div className="inline-flex items-center text-[10px] bg-white/20 px-2 py-0.5 rounded-full backdrop-blur-sm border border-white/10">
                      <TrendingUp className="w-3 h-3 mr-1" /> 实时更新
                   </div>
                </div>
             </div>
             
             <div 
               className="bg-gradient-to-br from-purple-500 to-fuchsia-600 p-4 rounded-2xl shadow-lg shadow-purple-200 relative overflow-hidden text-white cursor-pointer active:scale-95 transition-transform"
               onClick={() => onNavigate('INSTITUTION')}
             >
                <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
                <Wifi className="absolute -right-2 -bottom-2 w-16 h-16 text-white/10 rotate-12" />

                <div className="relative z-10">
                   <div className="flex items-center gap-1.5 text-purple-100 text-xs font-medium mb-2">
                      <div className="w-1.5 h-1.5 bg-purple-200 rounded-full"></div> 互联网医院
                   </div>
                   <div className="text-2xl font-bold tracking-tight mb-2">{data.kpi.internetHospitals} <span className="text-xs font-normal opacity-80">家</span></div>
                   <div className="inline-flex items-center text-[10px] bg-white/20 px-2 py-0.5 rounded-full backdrop-blur-sm border border-white/10">
                      较上月 +2
                   </div>
                </div>
             </div>
          </div>

          {/* Standard KPI Cards */}
          <div className="grid grid-cols-2 gap-3">
             <div 
               className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 cursor-pointer active:bg-slate-50 transition-colors"
               onClick={() => onNavigate('OPERATION')}
             >
                <div className="text-xs text-slate-500 mb-1">本月业务总量</div>
                <div className="text-lg font-bold text-slate-800">{data.kpi.totalVolume}</div>
                <div className="text-[10px] text-green-600 flex items-center mt-1">
                   <TrendingUp className="w-3 h-3 mr-1" /> +12.5%
                </div>
             </div>
             <div 
               className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 cursor-pointer active:bg-slate-50 transition-colors"
               onClick={() => onNavigate('INSTITUTION')}
             >
                <div className="text-xs text-slate-500 mb-1">接入机构总数</div>
                <div className="text-lg font-bold text-slate-800">{data.kpi.institutions}</div>
                <div className="text-[10px] text-slate-400 mt-1">覆盖率 {data.kpi.coverage}</div>
             </div>
          </div>

          {/* Trend Chart */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
             <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-slate-800 text-sm">近7日业务趋势</h3>
                <div className="flex gap-2 text-[10px]">
                   <span className="flex items-center gap-1 text-slate-500"><div className="w-2 h-2 rounded-full bg-blue-500"></div>远程</span>
                   <span className="flex items-center gap-1 text-slate-500"><div className="w-2 h-2 rounded-full bg-green-500"></div>互医</span>
                </div>
             </div>
             <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                   <AreaChart data={data.trend}>
                      <defs>
                         <linearGradient id="colorRemote" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                         </linearGradient>
                         <linearGradient id="colorInternet" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#22c55e" stopOpacity={0.1}/>
                            <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                         </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} />
                      <YAxis hide />
                      {/* Optimized Tooltip with specific names */}
                      <RechartsTooltip 
                        contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} 
                        labelStyle={{color: '#64748b', fontSize: '12px', marginBottom: '4px'}}
                        formatter={(value: any, name: any) => {
                           const displayName = name === 'remote' ? '远程医疗服务' : '互联网医院';
                           return [value, displayName];
                        }}
                      />
                      <Area type="monotone" dataKey="remote" stroke="#3b82f6" fillOpacity={1} fill="url(#colorRemote)" strokeWidth={2} name="remote" />
                      <Area type="monotone" dataKey="internet" stroke="#22c55e" fillOpacity={1} fill="url(#colorInternet)" strokeWidth={2} name="internet" />
                   </AreaChart>
                </ResponsiveContainer>
             </div>
          </div>

          {/* Rankings */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
             <h3 className="font-bold text-slate-800 text-sm mb-3">{data.rankingTitle}</h3>
             <div className="space-y-3">
                {data.rankings.map((item: any, idx: number) => (
                   <div key={idx} className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded flex items-center justify-center text-xs font-bold ${idx < 3 ? 'bg-yellow-100 text-yellow-700' : 'bg-slate-100 text-slate-500'}`}>
                         {idx + 1}
                      </div>
                      <div className="flex-1">
                         <div className="flex justify-between text-xs mb-1">
                            <span className="text-slate-700 font-medium">{item.name}</span>
                            <span className="text-slate-900 font-bold">{item.value}</span>
                         </div>
                         <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 rounded-full" style={{ width: `${item.value}%` }}></div>
                         </div>
                      </div>
                   </div>
                ))}
             </div>
          </div>
       </div>
    </div>
  );
};

const App = () => {
  const [currentView, setCurrentView] = useState<ViewState>('HOME');
  const [currentRegion, setCurrentRegion] = useState('贵州省');
  const [selectedHospital, setSelectedHospital] = useState<any>(null);

  const renderView = () => {
    switch (currentView) {
      case 'HOME': return <HomeView onNavigate={setCurrentView} data={getDashboardData(currentRegion)} />;
      case 'INSTITUTION': return <InstitutionRegulationView onBack={() => setCurrentView('HOME')} currentRegion={currentRegion} onRegionChange={setCurrentRegion} />;
      case 'RESOURCE': return <ResourceRegulationView onBack={() => setCurrentView('HOME')} currentRegion={currentRegion} onRegionChange={setCurrentRegion} />;
      case 'SERVICE': return <ServiceRegulationView onBack={() => setCurrentView('HOME')} currentRegion={currentRegion} onRegionChange={setCurrentRegion} />;
      case 'OPERATION': return <OperationRegulationView onBack={() => setCurrentView('HOME')} currentRegion={currentRegion} onRegionChange={setCurrentRegion} />;
      case 'QUALITY': return <QualityRegulationView onBack={() => setCurrentView('HOME')} currentRegion={currentRegion} onRegionChange={setCurrentRegion} />;
      case 'FINANCE': return <FinanceRegulationView onBack={() => setCurrentView('HOME')} currentRegion={currentRegion} onRegionChange={setCurrentRegion} onViewDetail={(hospital) => { setSelectedHospital(hospital); setCurrentView('FINANCE_DETAIL'); }} />;
      case 'FINANCE_DETAIL': return <FinanceHospitalDetailView hospital={selectedHospital} onBack={() => setCurrentView('FINANCE')} />;
      default: return <HomeView onNavigate={setCurrentView} data={getDashboardData(currentRegion)} />;
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen font-sans text-slate-900 max-w-md mx-auto shadow-2xl overflow-hidden relative">
       {/* Global Header only on Home for this design, subpages have their own headers */}
       {currentView === 'HOME' && <HeaderProfile currentRegion={currentRegion} onRegionChange={setCurrentRegion} />}
       
       <div className="h-full overflow-y-auto no-scrollbar">
          {renderView()}
       </div>
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);