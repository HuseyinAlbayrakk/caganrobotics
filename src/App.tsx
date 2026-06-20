/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Cpu, Rocket, Sparkles, BookOpen, Star, UserCheck, MessageSquare, 
  MapPin, Phone, Mail, Award, Compass, Layers, CheckCircle, 
  ChevronDown, HelpCircle, Send, Heart, Code2, ShieldAlert,
  ArrowRight, Users, Check, Flame, Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Navbar from './components/Navbar';
import CodingGame from './components/CodingGame';
import logo from './assets/logo.png';
import { Workshop, FAQItem, FeedbackSubmission } from './types';

// Kids and Parent Testimonials or pre-filled guest log
const INITIAL_SUBMISSIONS: FeedbackSubmission[] = [
  {
    id: '1',
    parentName: 'Merve Hanım',
    studentName: 'Alihan',
    studentAge: 9,
    phone: '0505******2',
    workshopInterest: 'Robotik Kodlama (Lego Boost & WeDo)',
    message: 'Alihan her hafta sonunu sabırsızlıkla bekliyor! Bize evde kendi tasarladığı robot algoritmalarını anlatıyor. Said Hocamıza çok minnettarız.',
    date: '19.06.2026',
    isApproved: true
  },
  {
    id: '2',
    parentName: 'Mustafa Bey',
    studentName: 'Zeynep Sıla',
    studentAge: 12,
    phone: '0553******9',
    workshopInterest: 'Yazılım Dünyası (Scratch & Python)',
    message: 'Kızım artık bilgisayarı sadece oyun oynamak için değil, kendi animasyon oyunlarını üretmek için kullanıyor. Kilis için muhteşem bir şans.',
    date: '18.06.2026',
    isApproved: true
  },
  {
    id: '3',
    parentName: 'Sibel Ögretmen',
    studentName: 'Arda',
    studentAge: 8,
    phone: '0542******1',
    workshopInterest: 'Eğlenceli Elektronik & Arduino',
    message: 'Derslerdeki pratik odaklı yaklaşım çocukların mühendislik ufkunu açıyor. Kesinlikle her çocuğun elinin değmesi gereken devre tahtaları var!',
    date: '15.06.2026',
    isApproved: true
  }
];

const WORKSHOPS: Workshop[] = [
  {
    id: 'scratch',
    title: 'Görsel Blok Kodlama (Scratch)',
    ageGroup: '7 - 10 Yaş Grubu',
    description: 'Çocukların rengarenk kod bloklarını sürükleyip bırakarak kendi çizgi filmlerini ve interaktif oyunlarını tasarladığı heyecan verici başlangıç adımı!',
    color: 'from-pink-500 to-rose-500',
    icon: 'Sparkles',
    features: ['Mantıksal Düşünme Becerisi', 'Karakter ve Sahne Tasarımı', 'Eğlenceli Algoritma Kurma'],
    gradient: 'border-pink-300 shadow-pink-100'
  },
  {
    id: 'robotics',
    title: 'Lego & Robotik Tasarım Atölyesi',
    ageGroup: '8 - 12 Yaş Grubu',
    description: 'Dişlileri, motorları güç modülleriyle birleştirip kendi fiziksel robot modellerini oluşturan çocuklar, sensörler yardımıyla robotlarına hayat veriyor!',
    color: 'from-amber-400 to-orange-500',
    icon: 'Cpu',
    features: ['3 Boyutlu Düşünme ve Üretim', 'Sensör & Motor Mekanizması', 'Hata Ayıklama (Problem Çözme)'],
    gradient: 'border-amber-300 shadow-amber-100'
  },
  {
    id: 'arduino',
    title: 'Elektrik & Arduino Dünyası',
    ageGroup: '11 - 15 Yaş Grubu',
    description: 'Gerçek elektronik devre elemanlarını birleştirip, akıllı lambalardan mesafe ölçerlere kadar kendi donanım projelerini programladıkları çılgın lab!',
    color: 'from-emerald-400 to-teal-600',
    icon: 'Code2',
    features: ['Mühendislik Temelleri', 'Devre Tahtası (Breadboard) Kullanımı', 'C++ Dilinin Temelleri'],
    gradient: 'border-emerald-300 shadow-emerald-100'
  },
  {
    id: 'python',
    title: 'Çocuklar İçin Yazılımcı Python',
    ageGroup: '12 - 16 Yaş Grubu',
    description: 'Teknoloji dünyasının en popüler yazılım dili Python ile tanışıp; veri yapıları, yapay zeka başlangıcı ve kod tabanlı yaratıcı programlar yazma sanatı!',
    color: 'from-indigo-500 to-sky-600',
    icon: 'Rocket',
    features: ['Metin Tabanlı Gerçek Kodlama', 'Matematiksel Zeka Gelişimi', 'Yazılım Geliştirici Altyapısı'],
    gradient: 'border-indigo-300 shadow-indigo-100'
  }
];

const FAQS: FAQItem[] = [
  {
    id: 'faq-1',
    question: 'Atölyelere katılmak için çocukların önceden kodlama bilgisi olması gerekiyor mu?',
    answer: 'Kesinlikle hayır! Tüm eğitimlerimiz sıfırdan başlar. Çocuğunuzun seviyesine uygun en eğlenceli ve anlaşılır aşamadan başlayarak onu özgüvenli birer dijital üreticiye dönüştürüyoruz.'
  },
  {
    id: 'faq-2',
    question: 'Eğitimlerde hangi ekipmanları ve robotları kullanıyorsunuz?',
    answer: 'Atölyemizde lisanslı LEGO robotik setleri, orijinal Arduino geliştirme kartları, çocukların yaratıcılığını destekleyen sensörler, mekanik yapboz parçaları ve her çocuğa özel tahsis edilmiş yüksek performanslı bilgisayarlar yer almaktadır.'
  },
  {
    id: 'faq-3',
    question: 'Kayıt süreci nasıl işliyor ve ders günleri/saatleri nasıl belirleniyor?',
    answer: 'Kayıt formunu doldurduktan hemen sonra Said Hocamız sizinle iletişime geçer. Öğrencimizin yaş grubu ve okul saatlerine (hafta sonu veya hafta içi okul çıkışı) göre en verimli butik grup planlamasını birlikte organize ederiz.'
  },
  {
    id: 'faq-4',
    question: 'Butik sınıf kontenjanlarınız kaç kişiden oluşuyor?',
    answer: 'Birebir ilgi ve her öğrencimizin teknolojik cihazlarla kesintisiz pratik yapabilmesi adına sınıflarımız maksimum 6-8 öğrenciden oluşur. Robotik parçaları paylaşmak yerine her öğrencimiz kendi robotunu oluşturur.'
  }
];

export default function App() {
  const [activeFAQ, setActiveFAQ] = useState<string | null>(null);
  const [submissions, setSubmissions] = useState<FeedbackSubmission[]>(INITIAL_SUBMISSIONS);
  
  // Submit Form States
  const [parentName, setParentName] = useState('');
  const [studentName, setStudentName] = useState('');
  const [studentAge, setStudentAge] = useState('');
  const [phone, setPhone] = useState('');
  const [workshopInterest, setWorkshopInterest] = useState('');
  const [message, setMessage] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [commentEmoji, setCommentEmoji] = useState('🚀');

  // Load from local storage if exists
  useEffect(() => {
    const saved = localStorage.getItem('cagan_robotics_feedbacks');
    if (saved) {
      try {
        setSubmissions(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load feedbacks", e);
      }
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!parentName || !studentName || !phone || !workshopInterest) {
      alert("Lütfen gerekli yıldızlı (*) alanları doldurunuz!");
      return;
    }

    setIsSubmitting(true);

    // Simulate database write
    setTimeout(() => {
      const newSubmission: FeedbackSubmission = {
        id: Date.now().toString(),
        parentName,
        studentName,
        studentAge: studentAge ? Number(studentAge) : 9,
        phone: phone.replace(/.(?=.{4})/g, '*'), // masking phone slightly for public view privacy
        workshopInterest,
        message: message || "Harika çalışmalar ve muazzam robotik eğitimi için sabırsızlanıyoruz!",
        date: new Date().toLocaleDateString('tr-TR'),
        isApproved: true
      };

      const updated = [newSubmission, ...submissions];
      setSubmissions(updated);
      localStorage.setItem('cagan_robotics_feedbacks', JSON.stringify(updated));

      // Reset form
      setParentName('');
      setStudentName('');
      setStudentAge('');
      setPhone('');
      setWorkshopInterest('');
      setMessage('');
      
      setIsSubmitting(false);
      setSubmitSuccess(true);
      
      // Reset success notification after a while
      setTimeout(() => setSubmitSuccess(false), 9000);
    }, 1000);
  };

  const getWorkshopIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sparkles': return <Sparkles className="w-7 h-7" />;
      case 'Cpu': return <Cpu className="w-7 h-7" />;
      case 'Code2': return <Code2 className="w-7 h-7" />;
      case 'Rocket': return <Rocket className="w-7 h-7" />;
      default: return <Cpu className="w-7 h-7" />;
    }
  };

  return (
    <div className="min-h-screen text-slate-800 font-sans selection:bg-indigo-600 selection:text-white bg-slate-55/40 overflow-x-hidden">
      
      {/* Decorative Grid Mesh Background */}
      <div className="absolute inset-0 mesh-bg -z-40 pointer-events-none" />
      <div className="absolute inset-0 dot-pattern opacity-[0.03] -z-35 pointer-events-none" />

      {/* Navigation header bar */}
      <Navbar />

      {/* HERO SECTION - Mixing Artistic Flair, Geometric Balance, and Bold Typography */}
      <section id="heros" className="pt-32 pb-20 md:pb-28 relative overflow-hidden">
        
        {/* Abstract Colorful Blobs & Geometric Wireframes (Artistic & Geometric Elements) */}
        <div className="absolute top-1/4 left-10 w-48 h-48 bg-pink-400/20 rounded-full blur-3xl animate-float-gentle -z-10" />
        <div className="absolute top-1/3 right-12 w-64 h-64 bg-indigo-400/20 rounded-full blur-3xl animate-float-reverse -z-10" />
        <div className="absolute bottom-10 left-1/3 w-32 h-32 bg-yellow-400/15 rounded-full blur-2xl animate-pulse -z-10" />

        {/* Floating Geometric Wireframes */}
        <div className="absolute top-24 left-[15%] text-pink-500/30 font-black text-7xl select-none pointer-events-none animate-float-gentle hidden lg:block">▲</div>
        <div className="absolute top-[60%] right-[10%] text-indigo-500/30 font-black text-8xl select-none pointer-events-none animate-float-reverse hidden lg:block">■</div>
        <div className="absolute bottom-[20%] left-[8%] text-yellow-500/30 font-black text-7xl select-none pointer-events-none rotate-45 hidden lg:block">●</div>
        <div className="absolute top-1/2 left-[48%] border-2 border-indigo-500/20 border-dashed w-32 h-32 rounded-full hidden md:block select-none pointer-events-none -z-15" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="text-center">
            
            {/* Interactive Badge */}
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-indigo-600 text-white font-black text-xs px-5 py-2 rounded-full shadow-lg transform hover:scale-105 transition duration-300 uppercase tracking-widest leading-loose">
              <Zap className="w-3.5 h-3.5 fill-white animate-bounce" /> KİLİS'İN EN KAPSAMLI ÇOCUK KODLAMA ATÖLYESİ
            </div>

            {/* BOLD TYPOGRAPHY DESIGN - Extra heavy headings with extreme font size */}
            <h1 className="mt-8 text-4xl sm:text-6xl md:text-8xl font-black text-slate-900 tracking-tighter leading-none uppercase">
              HAYAL EDEN <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-pink-500 to-amber-500 relative">
                KODLAYAN COŞAN
                {/* Hand-drawn style brush slash line overlay simulated by absolute border */}
                <span className="absolute bottom-1 left-0 right-0 h-4 bg-yellow-400/30 hover:bg-yellow-400/40 -z-10 rounded-full" />
              </span> <br />
              NESİLLER YETİŞİYOR!
            </h1>

            {/* Artistic introduction text */}
            <p className="mt-8 text-lg sm:text-xl text-slate-700 max-w-3xl mx-auto font-medium leading-relaxed">
              Kilis'te çocukları geleceğin üreticilerine dönüştürüyoruz! Elektrik-Elektronik Mühendisi <span className="font-extrabold text-indigo-600">Said Duran</span> kuruculuğunda eğlenceli robotlar, heyecan dolu kodlama dilleri ve gerçek devrelerle yarınları bugünden tasarlıyoruz.
            </p>

            {/* Geometric balanced buttons (Veli & Çocuk actions) */}
            <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
              <a
                id="hero-primary-cta"
                href="#iletisim"
                className="w-full sm:w-auto px-8 py-5 rounded-3xl bg-slate-900 hover:bg-indigo-600 text-white font-black text-lg shadow-xl hover:shadow-indigo-500/20 flex items-center justify-center gap-2.5 transition-all transform hover:translate-y-[-2px] active:translate-y-0"
              >
                Atölyeye Kaydol <ArrowRight className="w-5 h-5 text-indigo-300" />
              </a>
              <a
                id="hero-secondary-cta"
                href="#mini-oyun"
                className="w-full sm:w-auto px-8 py-5 rounded-3xl bg-white hover:bg-slate-50 text-slate-800 border-4 border-slate-950 font-black text-lg flex items-center justify-center gap-2 shadow-[4px_4px_0px_#000000] hover:shadow-[2px_2px_0px_#000000] transition-all hover:translate-x-1 hover:translate-y-1"
              >
                🎮 Mini Kodlama Oyunu Oyna
              </a>
            </div>

          </div>

          {/* Isometric Blueprint Frame (Geometric + Artistic Balancing mockup) */}
          <div className="mt-16 relative mx-auto max-w-5xl rounded-3xl border-4 border-slate-950 bg-white p-4 sm:p-6 shadow-[12px_12px_0px_#6366f1] overflow-hidden">
            
            {/* Design header matching robotic visual systems */}
            <div className="flex items-center justify-between border-b-4 border-slate-950 pb-4 mb-5">
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-full bg-rose-500 block" />
                <span className="w-3.5 h-3.5 rounded-full bg-amber-400 block" />
                <span className="w-3.5 h-3.5 rounded-full bg-indigo-500 block" />
                <span className="font-mono text-xs font-black text-slate-500 uppercase tracking-widest ml-1 hidden sm:inline">BUILD SYSTEM V2.4 // ONLINE</span>
              </div>
              <div className="bg-slate-100 px-3 py-1 rounded-lg border border-slate-300 font-mono text-[10px] font-bold text-slate-600 flex items-center gap-1">
                <Flame className="w-3 h-3 text-orange-500" /> KİLİS ÇAĞAN ROBOTICS ATÖLYE GÜNCESİ
              </div>
            </div>

            {/* Grid Showcase */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              
              <div className="p-6 bg-slate-50 rounded-2xl border-2 border-slate-200 hover:border-indigo-400 transition-colors group">
                <div className="w-12 h-12 rounded-xl bg-pink-100 flex items-center justify-center text-pink-500 mx-auto group-hover:scale-110 transition-transform">
                  <Compass className="w-6 h-6" />
                </div>
                <h3 className="font-black text-slate-900 text-lg mt-4">Uygulamalı Eğitim</h3>
                <p className="text-sm font-medium text-slate-600 mt-2">Sıkıcı ezberler yok! Çocuklar devre kurarak, lego robotlarını kodlayarak öğrenir.</p>
              </div>

              <div className="p-6 bg-slate-50 rounded-2xl border-2 border-slate-200 hover:border-amber-400 transition-colors group">
                <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center text-amber-500 mx-auto group-hover:scale-110 transition-transform">
                  <Cpu className="w-6 h-6" />
                </div>
                <h3 className="font-black text-slate-900 text-lg mt-4">Butik Sınıflar</h3>
                <p className="text-sm font-medium text-slate-600 mt-2">En fazla 6-8 öğrencili butik yapıda Said Hoca ile her çocuğa birebir teknik destek.</p>
              </div>

              <div className="p-6 bg-indigo-950 rounded-2xl border-2 border-indigo-800 text-white relative overflow-hidden group">
                <div className="absolute inset-0 diagonal-stripes pointer-events-none opacity-20" />
                <div className="w-12 h-12 rounded-xl bg-indigo-500/30 flex items-center justify-center text-indigo-300 mx-auto group-hover:scale-110 transition-transform relative z-10">
                  <Award className="w-6 h-6" />
                </div>
                <h3 className="font-black text-white text-lg mt-4 relative z-10">Uluslararası Müfredat</h3>
                <p className="text-sm font-semibold text-indigo-200 mt-2 relative z-10">Scratch, LEGO Boost, Arduino ve Python ile dünya çocuklarıyla aynı anda öğrenme keyfi.</p>
              </div>

            </div>

          </div>

          {/* Quick numbers tracker for extra credibility */}
          <div className="mt-12 flex justify-center flex-wrap gap-4 sm:gap-12">
            {[
              { count: "120+", text: "Mutlu Mucit Çocuk" },
              { count: "15+", text: "Kodlanabilir Robot Seti" },
              { count: "%100", text: "Uygulamalı Mühendislik" },
              { count: "5-15", text: "Yaş Sınırı" }
            ].map((stat, idx) => (
              <div key={idx} className="flex items-center gap-2.5">
                <span className="font-black text-3xl sm:text-4xl text-indigo-600">{stat.count}</span>
                <span className="text-xs sm:text-sm font-bold text-slate-600 border-l border-slate-300 pl-2.5">{stat.text}</span>
              </div>
            ))}
          </div>

        </div>

      </section>

      {/* CORE ATÖLYELERİMİZ SECTION - Balancing geometric shape modules and artistic background blobs */}
      <section id="atolyeler" className="py-24 bg-white border-y-4 border-slate-950 relative">
        <div className="absolute inset-0 diagonal-stripes pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
            <div>
              <span className="bg-rose-100 text-rose-800 text-xs font-black px-4 py-1.5 rounded-full inline-flex items-center gap-1">
                🤖 GELECEĞİN MÜHENDİSLİK AKADEMİSİ
              </span>
              <h2 className="text-3xl md:text-6xl font-black text-slate-900 tracking-tight mt-4 uppercase">
                ÖZEL <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-pink-500">MÜFREDATIMIZ</span>
              </h2>
            </div>
            <p className="text-slate-600 font-medium text-base md:text-lg max-w-md mt-4 md:mt-0 leading-relaxed">
              Her çocuk bir mucittir! Biz sadece onların içindeki kodları açığa çıkartıyoruz. Yaş gruplarına özel sunduğumuz programlarımızı keşfedin.
            </p>
          </div>

          {/* Interactive Bento-like Workshops grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {WORKSHOPS.map((workshop) => (
              <motion.div
                id={`workshop-card-${workshop.id}`}
                key={workshop.id}
                whileHover={{ y: -8 }}
                className={`bg-white rounded-3xl border-4 border-slate-950 p-6 flex flex-col justify-between hover:shadow-[8px_8px_0px_#1e1b4b] transition-all duration-300 relative group overflow-hidden ${workshop.gradient}`}
              >
                {/* Visual side decorations */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-indigo-500/5 to-pink-500/5 rounded-bl-full pointer-events-none" />
                
                <div>
                  <div className="flex justify-between items-start">
                    <div className="w-14 h-14 rounded-2xl bg-indigo-50 border-2 border-slate-950 flex items-center justify-center text-slate-950 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                      {getWorkshopIcon(workshop.icon)}
                    </div>
                    <span className="bg-slate-950 text-white font-mono text-[10px] uppercase tracking-wider px-3 py-1 rounded-full font-black">
                      {workshop.ageGroup}
                    </span>
                  </div>

                  <h3 className="font-black text-slate-900 text-xl tracking-tight mt-6 leading-tight group-hover:text-indigo-600 transition-colors">
                    {workshop.title}
                  </h3>

                  <p className="text-slate-600 font-semibold text-xs mt-3 leading-relaxed">
                    {workshop.description}
                  </p>
                </div>

                <div className="mt-8 pt-5 border-t-2 border-dashed border-slate-200">
                  <h4 className="font-extrabold text-xs text-indigo-950 uppercase mb-3">Kazanımlar:</h4>
                  <ul className="space-y-2">
                    {workshop.features.map((feature, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-1.5 text-xs font-bold text-slate-700">
                        <Check className="w-4 h-4 text-emerald-500 shrink-0" strokeWidth={3} />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6">
                  <a
                    href="#iletisim"
                    onClick={() => {
                      setWorkshopInterest(workshop.title);
                      document.querySelector('#iletisim')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="w-full text-center block bg-slate-50 hover:bg-slate-950 hover:text-white text-slate-900 border-2 border-slate-950 py-2.5 rounded-2xl font-bold text-xs transition-colors"
                  >
                    Bilgi ve Başvuru →
                  </a>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* WEB-BASED EMBEDDED CODING PUZZLE GAME SCREEN */}
      <CodingGame />

      {/* SAID DURAN FOUNDER SHOWCASE SECTION - Engineering with Geometric Balance and Bold Typography */}
      <section id="kurucu" className="py-24 bg-slate-900 text-white relative border-b-4 border-slate-950 overflow-hidden">
        
        {/* Futuristic circuit board wireframe simulation in the background */}
        <div className="absolute inset-0 diagonal-stripes pointer-events-none opacity-10" />
        <div className="absolute top-1/2 left-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left side: Bio Text / Bold Typography and Badges */}
            <div className="lg:col-span-7">
              
              <span className="bg-indigo-500 text-white text-xs font-black px-4 py-1.5 rounded-full tracking-widest uppercase inline-flex items-center gap-1.5">
                🔌 AKADEMİ KURUCUSU
              </span>
              
              <h2 className="text-4xl md:text-6xl font-black text-white mt-4 uppercase tracking-tighter leading-none">
                Eğitmen <br />
                <span className="text-yellow-400">SAİD DURAN</span>
              </h2>
              
              <h3 className="font-mono text-sm tracking-widest font-bold text-slate-400 mt-2 uppercase">
                ELEKTRİK ELEKTRONİK MÜHENDİSİ
              </h3>

              <div className="h-1 w-24 bg-pink-500 mt-6 mb-8 rounded-full" />

              <div className="space-y-4 font-semibold text-slate-300 leading-relaxed text-sm lg:text-base">
                <p>
                  Merhabalar ben <span className="text-white font-extrabold">Said Duran</span>. Üniversite eğitimimi bir elektrik-elektronik mühendisi olarak tamamladıktan sonra, teknolojinin ve üretimin kalbinin çocuk yaşta atılan tohumlarda saklı olduğunu fark ettim.
                </p>
                <p>
                  Kilis'te kurduğumuz <span className="text-white font-extrabold">Çağan Robotics</span> bünyesinde, her bir öğrencimizin sadece bilgisayar ekranı karşısında vakit öldüren pasif birer tüketici değil; kendi hayali olan makineleri, elektrik devrelerini ve akıllı yazılımları sıfırdan hayata getirebilen, özgüvenli mucitlere dönüşmesini hedefliyorum.
                </p>
                <p>
                  Atölyelerimizdeki butik sınıflarda eğlenceyi, mühendisliği ve yazılım disiplinini bir araya getirerek çocuklarımızın analitik düşünme potansiyellerini zirveye taşıyoruz. Geleceğin kodlarını birlikte yazmak için Kilis'teki tüm meraklı zihinleri davet ediyorum!
                </p>
              </div>

              {/* Said Duran credentials icons */}
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                <div className="flex items-center gap-3 bg-slate-800/80 p-4 rounded-2xl border border-slate-700/60">
                  <div className="bg-yellow-400/25 p-2 rounded-xl text-yellow-400">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-black text-xs text-white">Yılların Proje Birikimi</h4>
                    <p className="text-[10px] text-slate-400 mt-1">Geniş elektronik donanım tecrübesi</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-slate-800/80 p-4 rounded-2xl border border-slate-700/60">
                  <div className="bg-pink-400/25 p-2 rounded-xl text-pink-400">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-black text-xs text-white">Pedagojik Yaklaşım</h4>
                    <p className="text-[10px] text-slate-400 mt-1">Eğlenirken öğreten gelişim modülleri</p>
                  </div>
                </div>

              </div>

            </div>

            {/* Right side: Geometric Visual Showcase with high impact styling */}
            <div className="lg:col-span-5 relative mt-6 lg:mt-0">
              
              <div className="relative mx-auto max-w-[360px] aspect-square rounded-full border-12 border-indigo-950 shadow-2xl flex items-center justify-center p-8 bg-indigo-900">
                {/* Circuit board details */}
                <div className="absolute inset-4 rounded-full border border-dashed border-indigo-500/30 animate-spin" style={{ animationDuration: '60s' }} />
                <div className="absolute inset-8 rounded-full border-2 border-pink-500/20" />
                
                {/* Simulated Engineering avatar badge with high aesthetic contrast */}
                <div className="text-center relative z-10 select-none">
                  <div className="text-7xl mb-2 animate-bounce">⚡👨‍🔬🔌</div>
                  {/* Stylized custom badge representing Engineer Said Duran */}
                  <div className="bg-yellow-400 text-slate-950 font-black text-xs py-2 px-5 rounded-full border-2 border-slate-950 inline-block rotate-[-3deg] uppercase shadow-lg">
                    Said Duran, B.Sc.
                  </div>
                  <p className="text-[10px] text-indigo-200 mt-3 font-mono font-bold">
                    Electrical & Electronics Engineer
                  </p>
                  <p className="text-[9px] text-pink-300 mt-1 uppercase tracking-widest">
                    - Kilis Çağan Robotics Founder -
                  </p>
                </div>

                {/* Aesthetic geometric elements */}
                <div className="absolute top-0 right-10 bg-pink-500 w-6 h-6 rounded-full" />
                <div className="absolute bottom-10 left-5 bg-amber-400 w-8 h-8 rounded-lg rotate-12" />
                <div className="absolute bottom-5 right-12 bg-emerald-400 w-5 h-5 rounded-full" />
              </div>

              {/* Bold Speech block */}
              <div className="mt-8 bg-slate-800/90 border-2 border-indigo-500/40 p-5 rounded-2xl relative">
                <div className="absolute -top-3 left-8 text-3xl text-indigo-400 leading-none">“</div>
                <p className="italic font-bold text-xs text-indigo-100 leading-relaxed text-center">
                  Teknoloji tüketen değil, teknolojiyi tasarlayan zeka dolu çocuklarla Kilis'i geleceğe hazırlıyoruz!
                </p>
              </div>

            </div>

          </div>

        </div>

      </section>

      {/* FREQUENTLY ASKED QUESTIONS - Interactive Kids Accordion styled with playfulness */}
      <section id="faq" className="py-24 bg-slate-50 relative">
        <div className="absolute inset-0 dot-pattern opacity-[0.02] pointer-events-none" />
        
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          
          <div className="text-center mb-16">
            <span className="bg-yellow-100 text-yellow-800 text-xs font-black px-4 py-1.5 rounded-full inline-flex items-center gap-1.5 shadow-sm">
              <HelpCircle className="w-4 h-4 text-yellow-500 animate-spin" /> Merak Edilenler Günlüğü
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mt-4 uppercase">
              SIKÇA SORULAN <span className="text-indigo-600">SORULAR</span>
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-2 font-medium">
              Atölyelerimiz, yaş gruplarımız ve sınıflarımız hakkında aradığınız tüm hızlı yanıtlar.
            </p>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq) => {
              const isOpen = activeFAQ === faq.id;
              return (
                <div
                  key={faq.id}
                  className="bg-white rounded-2xl border-2 border-slate-200 overflow-hidden transition-all hover:border-indigo-400"
                >
                  <button
                    id={`faq-btn-${faq.id}`}
                    onClick={() => setActiveFAQ(isOpen ? null : faq.id)}
                    className="w-full text-left p-5 sm:p-6 font-extrabold text-slate-900 text-sm sm:text-base flex justify-between items-center gap-4 hover:bg-slate-50/50"
                  >
                    <span>{faq.question}</span>
                    <span className={`w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 transition-transform shrink-0 ${isOpen ? 'rotate-180 bg-indigo-600 text-white' : ''}`}>
                      <ChevronDown className="w-4 h-4" />
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={`faq-panel-${faq.id}`}
                        initial={{ height: 0 }}
                        animate={{ height: 'auto' }}
                        exit={{ height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5 sm:px-6 sm:pb-6 text-xs sm:text-sm font-semibold text-slate-600 leading-relaxed border-t border-slate-100 bg-indigo-50/10">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* FEEDBACK & PREREGISTRATION FORM (Parent logs and sign up with rich interactivity) */}
      <section id="iletisim" className="py-24 bg-white border-t-4 border-slate-950 relative overflow-hidden">
        
        {/* Colorful visual details */}
        <div className="absolute top-0 right-0 w-44 h-44 bg-pink-300/20 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-300/20 rounded-full blur-3xl -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
            
            {/* Left Box: Active Feedback Submission Form */}
            <div className="lg:col-span-7 bg-white rounded-3xl border-4 border-slate-950 p-6 sm:p-8 shadow-[10px_10px_0px_#1e1b4b] flex flex-col justify-between">
              
              <div>
                <span className="bg-pink-100 text-pink-800 text-xs font-black px-4 py-1.5 rounded-full inline-flex items-center gap-1.5 mb-4">
                  🚀 HEMEN İLETİŞİME GEÇİN VEYA KAYDOLUN!
                </span>
                <h3 className="font-black text-slate-900 text-2xl sm:text-3xl leading-tight">
                  Ön Kayıt ve <span className="text-pink-500">Ziyaretçi Günlüğü</span>
                </h3>
                <p className="text-xs sm:text-sm font-semibold text-slate-600 mt-2 leading-relaxed">
                  Çocuğunuz geleceğe muhteşem bir adım atsın! Aşağıdaki kısa form ile Said Hocamızla hemen iletişim kurabilir, soru sorabilir ya da ön kaydınızı bırakabilirsiniz. Gönderdiğiniz istekler anında aşağıdaki veli günlüğüne eklenir!
                </p>

                {/* Real-time Submitting Feedback */}
                <form onSubmit={handleSubmit} className="mt-8 space-y-4">
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-extrabold text-slate-800 uppercase mb-1.5">Veli Adı Soyadı *</label>
                      <input
                        id="form-parent-name"
                        type="text"
                        required
                        value={parentName}
                        onChange={(e) => setParentName(e.target.value)}
                        placeholder="Örn: Merih Alkan"
                        className="w-full bg-slate-50 border-2 border-slate-200 focus:border-indigo-500 rounded-xl px-4 py-3 font-semibold text-sm outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-extrabold text-slate-800 uppercase mb-1.5">Öğrenci Adı Soyadı *</label>
                      <input
                        id="form-student-name"
                        type="text"
                        required
                        value={studentName}
                        onChange={(e) => setStudentName(e.target.value)}
                        placeholder="Örn: Caner Alkan"
                        className="w-full bg-slate-50 border-2 border-slate-200 focus:border-indigo-500 rounded-xl px-4 py-3 font-semibold text-sm outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-extrabold text-slate-800 uppercase mb-1.5">Öğrenci Yaşı</label>
                      <input
                        id="form-student-age"
                        type="number"
                        min="5"
                        max="18"
                        value={studentAge}
                        onChange={(e) => setStudentAge(e.target.value)}
                        placeholder="Örn: 9"
                        className="w-full bg-slate-50 border-2 border-slate-200 focus:border-indigo-500 rounded-xl px-4 py-3 font-semibold text-sm outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-extrabold text-slate-800 uppercase mb-1.5">Telefon Numarası *</label>
                      <input
                        id="form-phone"
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Örn: 0555 123 4567"
                        className="w-full bg-slate-50 border-2 border-slate-200 focus:border-indigo-500 rounded-xl px-4 py-3 font-semibold text-sm outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-slate-800 uppercase mb-1.5">İlgilendiğiniz Atölye *</label>
                    <select
                      id="form-workshop"
                      required
                      value={workshopInterest}
                      onChange={(e) => setWorkshopInterest(e.target.value)}
                      className="w-full bg-slate-50 border-2 border-slate-200 focus:border-indigo-500 rounded-xl px-4 py-3 font-semibold text-sm outline-none transition-colors"
                    >
                      <option value="">Lütfen listeden seçin...</option>
                      <option value="Scratch Blok Kodlama (Giriş) - 7-10 Yaş">Scratch Blok Kodlama (Giriş) - 7-10 Yaş</option>
                      <option value="Robotik Tasarım & Lego Setleri - 8-12 Yaş">Robotik Tasarım & Lego Setleri - 8-12 Yaş</option>
                      <option value="Eğlenceli Donanım & Arduino Lab - 11-15 Yaş">Eğlenceli Donanım & Arduino Lab - 11-15 Yaş</option>
                      <option value="Hızlı Python Yazılım Dili - 12-16 Yaş">Hızlı Python Yazılım Dili - 12-16 Yaş</option>
                      <option value="Sadece Genel Bilgi Almak İstiyorum">Sadece Genel Bilgi Almak İstiyorum</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-slate-800 uppercase mb-1.5 flex justify-between">
                      <span>Mesajınız / Sorularınız veya Veli Yorumu</span>
                      <span className="text-[10px] text-indigo-500">Çocuklarla robotik heyecanı!</span>
                    </label>
                    <textarea
                      id="form-message"
                      rows={3}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Bizimle paylaşmak istediğiniz özel notunuz veya sormak istediğiniz sorular..."
                      className="w-full bg-slate-50 border-2 border-slate-200 focus:border-indigo-500 rounded-xl px-4 py-3 font-semibold text-sm outline-none transition-colors resize-none"
                    />
                  </div>

                  {/* Fun element select inside feedback */}
                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-xs font-bold text-slate-500">Gönderi Rozeti:</span>
                    <div className="flex gap-1">
                      {['🚀', '🤖', '💡', '🎓', '⚡', '🌟'].map(emoji => (
                        <button
                          key={emoji}
                          type="button"
                          onClick={() => setCommentEmoji(emoji)}
                          className={`w-7 h-7 rounded-lg text-sm flex items-center justify-center transition-all ${commentEmoji === emoji ? 'bg-indigo-600 text-white scale-110 shadow-md' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'}`}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>

                </form>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-100">
                
                <AnimatePresence>
                  {submitSuccess && (
                    <motion.div
                      id="submit-success-alert"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="mb-4 bg-emerald-50 border-2 border-emerald-400/50 p-4 rounded-2xl text-emerald-900 font-bold text-xs flex items-center gap-2.5"
                    >
                      <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                      <div>
                        Harika! Kayıt talebiniz başarıyla alındı ve aşağıda listelenen Ziyaretçi Günlüğü'ne yeni bir yorum olarak kaydedildi. Said Duran Hocamız en kısa zamanda sizinle iletişime geçecektir.
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <button
                  id="form-submit-btn"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="w-full bg-pink-500 hover:bg-pink-600 active:scale-[0.99] hover:shadow-lg text-white font-black text-base py-4 px-6 rounded-2xl flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Send className="w-5 h-5 text-pink-200 fill-white/10" />
                  {isSubmitting ? 'Talebiniz Robotlara Gönderiliyor...' : 'Ön Kaydı Bitir ve Gönder!'}
                </button>
              </div>

            </div>

            {/* Right Box: Quick Contacts & Location Schematic */}
            <div className="lg:col-span-5 flex flex-col justify-between gap-6">
              
              {/* Contact card */}
              <div className="bg-indigo-950 text-white rounded-3xl p-6 sm:p-8 border-4 border-slate-950 shadow-md relative overflow-hidden">
                <div className="absolute inset-0 diagonal-stripes pointer-events-none opacity-10" />
                <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl" />

                <h4 className="font-black text-xl text-yellow-400 uppercase tracking-tight mb-4">İLETİŞİM BİLGİLERİ</h4>
                
                <div className="space-y-5 relative z-10">
                  
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-indigo-900 flex items-center justify-center text-indigo-300 border border-indigo-800 shrink-0">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <h5 className="font-mono text-[10px] text-indigo-300 font-bold uppercase tracking-widest">ATÖLYE ADRESİ</h5>
                      <p className="text-xs font-bold text-white mt-1 leading-relaxed">
                        Kilis Merkez, Çağan Robotik Kodlama ve Teknoloji Atölyesi, Kilis / Türkiye
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-indigo-900 flex items-center justify-center text-indigo-300 border border-indigo-800 shrink-0">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <h5 className="font-mono text-[10px] text-indigo-300 font-bold uppercase tracking-widest">TELEFON / WHATSAPP</h5>
                      <a href="tel:05051234567" className="text-sm font-black text-white hover:text-yellow-300 transition-colors block mt-1">
                        +90 505 123 45 67
                      </a>
                      <span className="text-[10px] block mt-0.5 text-slate-400">Aranabilir / Said Duran (Mühendis)</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-indigo-900 flex items-center justify-center text-indigo-300 border border-indigo-800 shrink-0">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <h5 className="font-mono text-[10px] text-indigo-300 font-bold uppercase tracking-widest">E-EPOSTA ADRESİ</h5>
                      <a href="mailto:info@caganrobotics.com" className="text-xs font-bold text-white hover:text-yellow-300 transition-colors mt-1 block">
                        info@caganrobotics.com
                      </a>
                    </div>
                  </div>

                </div>

                {/* Call Out Badges to parents */}
                <div className="mt-8 p-4 bg-indigo-900/60 rounded-2xl border border-indigo-800">
                  <div className="flex items-center gap-2 text-yellow-300 font-black text-xs">
                    <Star className="w-4 h-4 fill-yellow-400" /> KİLİS'E ÖZEL ÜCRETSİZ TANITIM SEANSI
                  </div>
                  <p className="text-[10.5px] text-slate-300 mt-1.5 leading-relaxed font-semibold">
                    Kayıt yaptırmadan önce çocuğunuzun robotik eğilimini test etmek için bizi ziyaret edin, Said Duran hocamızla ücretsiz ön görüşme organize edelim!
                  </p>
                </div>

              </div>

              {/* Colorful map mock element with kids engineering pattern */}
              <div className="bg-slate-100 rounded-3xl p-6 border-4 border-slate-950 shadow-md relative overflow-hidden flex-1 min-h-[160px] flex flex-col justify-between">
                <div className="absolute inset-0 dot-pattern opacity-[0.05] pointer-events-none" />
                
                <div>
                  <h4 className="font-black text-sm text-slate-950 uppercase tracking-wider flex items-center gap-1.5">
                    <Compass className="w-4 h-4 text-pink-500" /> Kilis Atölye Konumu
                  </h4>
                  <p className="text-[11px] font-bold text-slate-600 mt-1 leading-relaxed">
                    Atölyemiz Kilis merkezinde, ulaşımı son derece kolay ve güvenli bir muhittedir.
                  </p>
                </div>

                <div className="mt-4">
                  <a
                    id="map-external-link-btn"
                    href="https://maps.google.com"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 bg-white hover:bg-slate-50 text-slate-900 border-2 border-slate-950 font-black text-xs py-2 px-4 rounded-xl shadow-sm transition-transform active:scale-95 duration-100"
                  >
                    Google Haritada Göster📍
                  </a>
                </div>

                {/* Engineering Schematic details (Geometric Balance) */}
                <div className="absolute bottom-2 right-2 font-mono text-[9px] text-slate-400 font-bold select-none mb-1 mr-1">
                  LAT: 36.7165 // LNG: 37.1211
                </div>
              </div>

            </div>

          </div>

          {/* REAL-TIME VISITOR LOG - Parents can see their submissions instantly added */}
          <div className="mt-16 bg-slate-50 border-4 border-slate-950 p-6 sm:p-8 rounded-3xl relative">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b-2 border-dashed border-slate-200 pb-5 mb-6 gap-3">
              <div>
                <h4 className="font-black text-slate-950 text-xl flex items-center gap-1.5 uppercase tracking-tight">
                  <span className="text-xl">📒</span> KİLİS ÇAĞAN ROBOTİCS VELİ & ÇOCUK Yorumları
                </h4>
                <p className="text-[11px] sm:text-xs text-slate-500 font-bold mt-1">
                  Atölyemiz öğrencilerinden ve velilerinden gerçek zamanlı canlı geri bildirimler (Son Eklenenler Üstte Listelenir)
                </p>
              </div>
              <div className="bg-indigo-600 text-white font-mono text-[10px] font-black px-3 py-1.5 rounded-full select-none text-center">
                TOPLAM YORUM: {submissions.length} DETAY
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <AnimatePresence>
                {submissions.slice(0, 6).map((sub, sIdx) => (
                  <motion.div
                    id={`submission-item-${sub.id}`}
                    key={sub.id}
                    initial={{ opacity: 0, scale: 0.95, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="bg-white border-2 border-slate-200 hover:border-indigo-400 p-5 rounded-2xl relative shadow-sm flex flex-col justify-between"
                  >
                    {/* Floating pink heart or emoji represent kids fun comments */}
                    <div className="absolute top-4 right-4 text-lg">
                      {sIdx === 0 ? commentEmoji : '🌟'}
                    </div>

                    <div>
                      {/* Subtitle about workshop of interest */}
                      <span className="block text-[10px] font-black text-indigo-600 uppercase tracking-wider bg-indigo-50 px-2 py-0.5 rounded-md inline-block">
                        {sub.workshopInterest}
                      </span>

                      {/* Comment text */}
                      <p className="text-slate-700 font-medium text-xs sm:text-sm mt-3.5 leading-relaxed italic">
                        "{sub.message}"
                      </p>
                    </div>

                    <div className="mt-6 pt-3.5 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        {/* Parent and child details */}
                        <h5 className="font-extrabold text-xs text-slate-900">
                          {sub.parentName} <span className="text-slate-400 font-medium font-sans">({sub.studentName} Vela'sı)</span>
                        </h5>
                        <p className="text-[10px] font-bold text-slate-400 mt-0.5">
                          Öğrenci Yaşı: {sub.studentAge} | Gönderim: {sub.date}
                        </p>
                      </div>
                      <div className="w-7 h-7 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center shrink-0" title="Doğrulanmış Veli">
                        <Check className="w-4 h-4" strokeWidth={3} />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            
            <div className="text-center mt-8">
              <p className="text-[11px] text-slate-400 font-bold italic">
                * Bu sayfadaki yorumlar ve kayıt talepleri veliler ve öğrenciler tarafından canlı eklenmiş ve tarayıcı belleğinde (localStorage) güvenle saklanmaktadır.
              </p>
            </div>

          </div>

        </div>

      </section>

      {/* FOOTER SECTION - Artistic Logo & Copyright branding */}
      <footer className="bg-slate-950 text-slate-400 py-16 border-t-4 border-slate-950 relative">
        <div className="absolute inset-0 diagonal-stripes pointer-events-none opacity-5" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 pb-10 border-b border-slate-900">
            
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-3">
                <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center shadow-lg overflow-hidden shrink-0">
                  <img src={logo} alt="Çağan Robotics Logo" className="w-full h-full object-contain p-1" />
                </div>
                <div>
                  <span className="text-xl font-black text-white tracking-tight block">
                    ÇAĞAN <span className="text-indigo-500">ROBOTICS</span>
                  </span>
                  <span className="text-[9px] font-mono font-bold text-slate-500 tracking-wider block">
                    KİLİS ÇOCUK KODLAMA VE GELİŞTİRME ATÖLYESİ
                  </span>
                </div>
              </div>
              <p className="text-slate-500 text-xs mt-3.5 max-w-md font-semibold leading-relaxed">
                Said Duran tarafından kurulan atölyemizdeki vizyonumuz; Kilis'te teknoloji, yazılım, robotik alanlarında fark yaratarak geleceğin mimarı çocuklarımızı şimdiden hayallerine kavuşturmaktır.
              </p>
            </div>

            {/* Quick footer navigation links */}
            <div className="flex flex-wrap justify-center gap-6 text-sm font-black">
              <a href="#heros" className="text-white hover:text-indigo-400 transition-colors">Ana Sayfa</a>
              <a href="#atolyeler" className="text-white hover:text-indigo-400 transition-colors">Atölyelerimiz</a>
              <a href="#mini-oyun" className="text-white hover:text-indigo-400 transition-colors">Mini Oyun</a>
              <a href="#kurucu" className="text-white hover:text-indigo-400 transition-colors">Said Duran</a>
              <a href="#iletisim" className="text-white hover:text-indigo-400 transition-colors">Kayıt & İletişim</a>
            </div>

          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between text-xs font-bold text-slate-600 pt-8 gap-4 text-center sm:text-left">
            <div>
              © 2026 Kilis Çağan Robotics. Tüm Hakları Saklıdır.
            </div>
            <div className="flex items-center gap-1">
              Elektrik Elektronik Mühendisi <span className="text-slate-400">Said Duran</span> tarafından sevgi ve bilimle tasarlanmıştır <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 animate-pulse ml-1 inline" />
            </div>
          </div>

        </div>

      </footer>

    </div>
  );
}
