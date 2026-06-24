"use client";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import st from "./page.module.css";

const WEDDING_DATE = new Date("2026-12-20T09:00:00");

const DRESS_CODES = [
  { color: "#A8C5AA", name: "Sage Green", note: "Warna tema utama", hex: "#A8C5AA" },
  { color: "#E8B9A8", name: "Dusty Rose", note: "Warna pendamping", hex: "#E8B9A8" },
  { color: "#F5F0E8", name: "Ivory White", note: "Putih gading elegan", hex: "#F5F0E8" },
  { color: "#C4B49A", name: "Champagne", name2: "Tan", note: "Netral hangat", hex: "#C4B49A" },
];

const STORIES = [
  {
    year: "2019",
    emoji: "🎓",
    title: "Pertama Bertemu",
    desc: "Di koridor kampus yang ramai, Andi tidak sengaja menjatuhkan buku Sari. Dari situ, obrolan kecil dimulai yang mengubah hidup keduanya selamanya.",
    img: "/images/gallery1.png",
  },
  {
    year: "2021",
    emoji: "🌹",
    title: "Resmi Berpacaran",
    desc: "Setelah dua tahun menjadi sahabat dekat, Andi memberanikan diri mengungkapkan hati dengan setangkai mawar merah di bawah pohon rindang.",
    img: "/images/gallery3.png",
  },
  {
    year: "2025",
    emoji: "💍",
    title: "Lamaran",
    desc: "Sari terkejut saat Andi berlutut di tengah taman bunga favoritnya, disaksikan keluarga dan sahabat terdekat. Jawaban 'iya' membuat semua orang menangis bahagia.",
    img: "/images/gallery2.png",
  },
];

const INIT_WISHES = [
  { name: "Pak Budi & Keluarga", wish: "Semoga menjadi keluarga sakinah, mawaddah warahmah. Bahagia selalu!", hadir: "hadir" },
  { name: "Ayu & Dinda", wish: "Congratulations!! Semoga langgeng hingga akhir hayat, segera dikaruniai momongan 🤍", hadir: "hadir" },
  { name: "Tim Kantor Andi", wish: "Selamat menempuh hidup baru. Maaf kami tak bisa hadir, tapi doa selalu menyertai!", hadir: "tidak_hadir" },
];

const GIFTS = [
  { icon: "🏦", bank: "Bank Mandiri", name: "Andi Pratama", num: "1380 0088 8888", copy: "13800088888" },
  { icon: "🏦", bank: "Bank BCA", name: "Sari Dewi", num: "0813 4567 8910", copy: "081345678910" },
];

const NAV_ITEMS = [
  { id: "hero", label: "Home" },
  { id: "couple", label: "Mempelai" },
  { id: "story", label: "Kisah" },
  { id: "event", label: "Acara" },
  { id: "dress", label: "Dress Code" },
  { id: "gallery", label: "Galeri" },
  { id: "rsvp", label: "RSVP" },
];

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [countdown, setCountdown] = useState({ d: 0, h: 0, m: 0, s: 0 });
  const [activeSection, setActiveSection] = useState("hero");
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const [activeGift, setActiveGift] = useState(0);
  const [copied, setCopied] = useState(false);
  const [form, setForm] = useState({ name: "", wish: "", hadir: "hadir" });
  const [wishes, setWishes] = useState(INIT_WISHES);
  const [submitted, setSubmitted] = useState(false);
  const [visible, setVisible] = useState<Set<string>>(new Set());
  const refs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    const t = setInterval(() => {
      const diff = WEDDING_DATE.getTime() - Date.now();
      if (diff > 0) {
        setCountdown({
          d: Math.floor(diff / 86400000),
          h: Math.floor((diff % 86400000) / 3600000),
          m: Math.floor((diff % 3600000) / 60000),
          s: Math.floor((diff % 60000) / 1000),
        });
      }
    }, 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (!showContent) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setVisible((prev) => new Set([...prev, e.target.id]));
            setActiveSection(e.target.id);
          }
        });
      },
      { threshold: 0.15 }
    );
    Object.values(refs.current).forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, [showContent]);

  const reg = (id: string) => (el: HTMLElement | null) => { refs.current[id] = el; };
  const isV = (id: string) => visible.has(id);

  const handleOpen = () => {
    setIsOpen(true);
    setTimeout(() => setShowContent(true), 900);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.wish) return;
    setWishes([{ name: form.name, wish: form.wish, hadir: form.hadir }, ...wishes]);
    setForm({ name: "", wish: "", hadir: "hadir" });
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  const galleryImages = ["/images/gallery1.png", "/images/gallery2.png", "/images/gallery3.png", "/images/gallery4.png"];

  return (
    <>
      {/* ========== ENVELOPE COVER ========== */}
      <div className={`${st.envelopeWrap} ${isOpen ? st.opening : st.closed}`}>
        {/* Bokeh light effects */}
        <div className={st.bokehContainer} aria-hidden="true">
          {[...Array(20)].map((_, i) => (
            <span key={i} className={st.bokeh} style={{
              "--bx": `${5 + Math.random() * 90}%`,
              "--by": `${5 + Math.random() * 90}%`,
              "--bs": `${8 + Math.random() * 40}px`,
              "--bd": `${3 + Math.random() * 5}s`,
              "--bdelay": `${Math.random() * 4}s`,
              "--bop": `${0.03 + Math.random() * 0.12}`,
            } as React.CSSProperties} />
          ))}
        </div>

        {/* Floating sparkles */}
        <div className={st.sparkleContainer} aria-hidden="true">
          {[...Array(15)].map((_, i) => (
            <span key={i} className={st.sparkle} style={{
              "--sx": `${Math.random() * 100}%`,
              "--sy": `${Math.random() * 100}%`,
              "--sd": `${2 + Math.random() * 3}s`,
              "--sdelay": `${Math.random() * 5}s`,
            } as React.CSSProperties}>✦</span>
          ))}
        </div>

        {/* Soft light rays from top */}
        <div className={st.lightRays} aria-hidden="true" />

        {/* Floral decorations */}
        <div className={st.floralTop} aria-hidden="true">
          <Image src="/images/floral-top.png" alt="" width={500} height={500} priority />
        </div>
        <div className={st.floralBottom} aria-hidden="true">
          <Image src="/images/floral-bottom.png" alt="" width={500} height={500} priority />
        </div>

        {/* === ENVELOPE STRUCTURE === */}
        <div className={st.envelopeScene}>
          {/* Letter/Card emerging from envelope */}
          <div className={st.letterCard}>
            <div className={st.letterInner}>
              {/* Ornamental border */}
              <div className={st.letterBorderOrnament} />
              
              <p className={st.envelopeTo}>Kepada Yth.</p>
              <p className={st.envelopeGuest}>Bapak / Ibu / Saudara/i<br />Tamu Undangan</p>
              
              <div className={st.letterOrnamentLine}>
                <span />
                <span className={st.letterDiamond}>◆</span>
                <span />
              </div>

              <p className={st.envelopeSubtitle}>The Wedding Of</p>
              <h1 className={st.envelopeNames}>Andi</h1>
              <p className={st.envelopeAmpersand}>&</p>
              <h1 className={st.envelopeNames}>Sari</h1>

              <div className={st.envelopeDateWrap}>
                <span className={st.envelopeDateLine} />
                <p className={st.envelopeDate}>20 · 12 · 2026</p>
                <span className={st.envelopeDateLine} />
              </div>

              {/* Mini countdown */}
              <div className={st.envelopeCountdown}>
                <div className={st.envCdItem}>
                  <span className={st.envCdNum}>{String(countdown.d).padStart(2, "0")}</span>
                  <span className={st.envCdLabel}>Hari</span>
                </div>
                <span className={st.envCdSep}>|</span>
                <div className={st.envCdItem}>
                  <span className={st.envCdNum}>{String(countdown.h).padStart(2, "0")}</span>
                  <span className={st.envCdLabel}>Jam</span>
                </div>
                <span className={st.envCdSep}>|</span>
                <div className={st.envCdItem}>
                  <span className={st.envCdNum}>{String(countdown.m).padStart(2, "0")}</span>
                  <span className={st.envCdLabel}>Menit</span>
                </div>
                <span className={st.envCdSep}>|</span>
                <div className={st.envCdItem}>
                  <span className={st.envCdNum}>{String(countdown.s).padStart(2, "0")}</span>
                  <span className={st.envCdLabel}>Detik</span>
                </div>
              </div>
            </div>
          </div>

          {/* Actual Envelope body */}
          <div className={st.envelopeBody}>
            {/* Envelope flap (triangle) */}
            <div className={st.envelopeFlap} />
            {/* Wax seal */}
            <div className={st.waxSeal}>
              <span className={st.waxSealInner}>A&S</span>
            </div>
            {/* Envelope front face */}
            <div className={st.envelopeFront}>
              <div className={st.envelopeLining} />
            </div>
          </div>

          {/* Open button below envelope */}
          <button id="btn-buka-undangan" className={st.envelopeBtn} onClick={handleOpen}>
            <span className={st.envBtnAni}>💌</span>
            Buka Undangan
          </button>
        </div>
      </div>

      {showContent && (
        <main className={st.main}>
          {/* Falling Leaves */}
          <div className={st.leavesContainer} aria-hidden="true">
            {["🍃", "🌿", "🍀", "🌱", "🍃", "🌿", "🍀", "🌱"].map((leaf, i) => (
              <span key={i} className={st.leaf} style={{
                "--left": `${(i * 12.5) % 100}%`,
                "--delay": `${i * 1.3}s`,
                "--dur": `${9 + i * 0.7}s`,
                "--size": `${0.9 + (i % 3) * 0.3}rem`,
              } as React.CSSProperties}>{leaf}</span>
            ))}
          </div>


          {/* ========== HERO ========== */}
          <section id="hero" className={st.hero} ref={reg("hero")}>
            <div className={st.heroImgSide}>
              <Image src="/images/groom.png" alt="Andi & Sari" fill className={st.heroImg} priority />
              <div className={st.heroImgOverlay} />
            </div>
            <div className={st.heroContent}>
              <p className={st.heroEyebrow}>— Undangan Pernikahan —</p>
              <h2 className={st.heroAnd}>
                <span>Andi</span>
                <span className={st.heroAmpersand}>&</span>
                <span>Sari</span>
              </h2>
              <div className={st.heroDivLine} />
              <p className={st.heroDate}>Minggu, 20 Desember 2026</p>
              <p className={st.heroLocation}>📍 Bandung, Jawa Barat</p>
              <div className={st.heroActions}>
                <button className={st.heroBtnPrimary} onClick={() => scrollTo("event")}>
                  📅 Lihat Acara
                </button>
                <button className={st.heroBtnOutline} onClick={() => scrollTo("rsvp")}>
                  💌 RSVP
                </button>
              </div>
            </div>

          </section>

          {/* ========== QUOTE ========== */}
          <section
            id="quote"
            className={`${st.quoteSection} ${isV("quote") ? st.reveal : st.hidden}`}
            ref={reg("quote")}
          >
            <div className={st.quoteBg} aria-hidden="true">❝</div>
            <div className={st.quoteFrame}>
              <p className={st.quoteText}>
                "Dan di antara tanda-tanda kebesaran-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang."
              </p>
              <p className={st.quoteSource}>— QS. Ar-Rūm: 21 —</p>
            </div>
          </section>

          {/* ========== COUPLE ========== */}
          <section id="couple" className={st.coupleSection} ref={reg("couple")}>
            <div style={{ textAlign: "center", marginBottom: "3rem" }}>
              <span className={st.sectionLabel}>Mempelai</span>
              <h2 className={st.sectionH}>Dua Hati, <em>Satu Tujuan</em></h2>
            </div>
            <div className={`${st.coupleRow} ${isV("couple") ? "" : ""}`}>
              {/* Groom */}
              <div className={`${st.couplePerson} ${isV("couple") ? st.revealL : st.hiddenL}`}>
                <div className={st.coupleImgFrame}>
                  <div className={st.coupleImgInner}>
                    <Image src="/images/groom.png" alt="Andi Pratama" fill />
                  </div>
                </div>
                <div className={st.coupleNameTag}>Andi Pratama</div>
                <p className={st.coupleFamilyTag}>
                  Putra Sulung dari<br />Bpk. Hendra & Ibu Wati
                </p>
              </div>
              {/* Center */}
              <div className={`${st.coupleCenter} ${isV("couple") ? st.reveal : st.hidden}`}>
                <div className={st.coupleAnd}>&</div>
                <div className={st.coupleRings}>💍</div>
              </div>
              {/* Bride */}
              <div className={`${st.couplePerson} ${isV("couple") ? st.revealR : st.hiddenR}`}>
                <div className={st.coupleImgFrame}>
                  <div className={st.coupleImgInner}>
                    <Image src="/images/bride.png" alt="Sari Dewi" fill />
                  </div>
                </div>
                <div className={st.coupleNameTag}>Sari Dewi</div>
                <p className={st.coupleFamilyTag}>
                  Putri Bungsu dari<br />Bpk. Rudi & Ibu Erna
                </p>
              </div>
            </div>
          </section>

          {/* ========== COUNTDOWN ========== */}
          <section
            id="countdown"
            className={`${st.countdownSection} ${isV("countdown") ? st.reveal : st.hidden}`}
            ref={reg("countdown")}
          >
            <span className={st.sectionLabel}>Menuju Hari H</span>
            <h2 className={st.sectionH}>Hitung Mundur</h2>
            <div className={st.cdGrid}>
              <div className={st.cdItem}>
                <span className={st.cdNum}>{String(countdown.d).padStart(2, "0")}</span>
                <span className={st.cdLabel}>Hari</span>
              </div>
              <span className={st.cdSep}>:</span>
              <div className={st.cdItem}>
                <span className={st.cdNum}>{String(countdown.h).padStart(2, "0")}</span>
                <span className={st.cdLabel}>Jam</span>
              </div>
              <span className={st.cdSep}>:</span>
              <div className={st.cdItem}>
                <span className={st.cdNum}>{String(countdown.m).padStart(2, "0")}</span>
                <span className={st.cdLabel}>Menit</span>
              </div>
              <span className={st.cdSep}>:</span>
              <div className={st.cdItem}>
                <span className={st.cdNum}>{String(countdown.s).padStart(2, "0")}</span>
                <span className={st.cdLabel}>Detik</span>
              </div>
            </div>
          </section>

          {/* ========== LOVE STORY ========== */}
          <section id="story" className={st.storySection} ref={reg("story")}>
            <span className={st.sectionLabel}>Perjalanan Cinta</span>
            <h2 className={st.sectionH}>Kisah <em>Kita</em></h2>
            <p className={st.sectionSub}>Setiap momen kecil yang membawa kita ke hari ini.</p>
            <div className={st.storyGrid}>
              {STORIES.map((s, i) => (
                <div
                  key={i}
                  className={`${st.storyItem} ${isV("story") ? (i % 2 === 0 ? st.revealL : st.revealR) : i % 2 === 0 ? st.hiddenL : st.hiddenR}`}
                  style={{ transitionDelay: `${i * 0.2}s` }}
                >
                  <div className={st.storyImg}>
                    <Image src={s.img} alt={s.title} fill />
                    <span className={st.storyYearBadge}>{s.year}</span>
                  </div>
                  <div className={st.storyText}>
                    <span className={st.storyEmoji}>{s.emoji}</span>
                    <h3 className={st.storyTitle}>{s.title}</h3>
                    <p className={st.storyDesc}>{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ========== EVENTS ========== */}
          <section id="event" ref={reg("event")}>
            <div className={`${st.eventsSection} ${isV("event") ? st.reveal : st.hidden}`}>
              <div className={st.eventsInner}>
                <span className={st.sectionLabel}>Rangkaian Acara</span>
                <h2 className={st.sectionH}>Hadir & <em>Doakan Kami</em></h2>
                <p className={st.sectionSub} style={{ marginBottom: "2.5rem" }}>
                  Kami dengan segenap kerendahan hati mengundang kehadiran Anda.
                </p>
                <div className={st.eventsGrid}>
                  {[
                    {
                      icon: "🕌", type: "Akad Nikah", name: "Ijab Qabul",
                      date: "Minggu, 20 Desember 2026",
                      time: "09:00 – 11:00 WIB",
                      place: "Masjid Al-Irsyad, Jl. Padjajaran No.1, Bandung",
                      maps: "https://maps.google.com",
                    },
                    {
                      icon: "🎊", type: "Resepsi Pernikahan", name: "Walimatul Ursy",
                      date: "Minggu, 20 Desember 2026",
                      time: "11:30 – Selesai",
                      place: "The Trans Luxury Hotel, Jl. Gatot Subroto No.289, Bandung",
                      maps: "https://maps.google.com",
                    },
                  ].map((ev) => (
                    <div key={ev.type} className={st.evCard}>
                      <div className={st.evCardAccent} />
                      <span className={st.evIcon}>{ev.icon}</span>
                      <p className={st.evType}>{ev.type}</p>
                      <h3 className={st.evName}>{ev.name}</h3>
                      <div className={st.evRow}><span className={st.evRowIcon}>📅</span><span>{ev.date}</span></div>
                      <div className={st.evRow}><span className={st.evRowIcon}>⏰</span><span>{ev.time}</span></div>
                      <div className={st.evRow}><span className={st.evRowIcon}>📍</span><span>{ev.place}</span></div>
                      <a href={ev.maps} target="_blank" rel="noreferrer" className={st.evMapBtn}>
                        🗺️ Buka di Google Maps
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ========== DRESS CODE ========== */}
          <section
            id="dress"
            className={`${st.dressSection} ${isV("dress") ? st.reveal : st.hidden}`}
            ref={reg("dress")}
          >
            <span className={st.sectionLabel}>Dress Code</span>
            <h2 className={st.sectionH}>Panduan <em>Berpakaian</em></h2>
            <p className={st.sectionSub}>Untuk tampil serasi bersama kami, pilih salah satu palet warna berikut.</p>
            <div className={st.dressGrid}>
              {DRESS_CODES.map((dc) => (
                <div key={dc.name} className={st.dressCard}>
                  <div className={st.dressSwatch} style={{ background: dc.color }} />
                  <p className={st.dressColorName}>{dc.name}</p>
                  <p className={st.dressNote}>{dc.note}</p>
                </div>
              ))}
            </div>

          </section>

          {/* ========== GALLERY ========== */}
          <section id="gallery" ref={reg("gallery")}>
            <div className={`${st.gallerySection} ${isV("gallery") ? st.reveal : st.hidden}`}>
              <div className={st.galleryInner}>
                <span className={st.sectionLabel}>Galeri Foto</span>
                <h2 className={st.sectionH}>Momen <em>Berharga</em></h2>
                <div className={st.masonryGrid}>
                  {galleryImages.map((src, i) => (
                    <div key={i} className={st.masonryItem} onClick={() => setLightboxSrc(src)}>
                      <Image src={src} alt={`Foto ${i + 1}`} width={600} height={i % 2 === 0 ? 400 : 300} />
                      <div className={st.masonryOverlay}>🔍</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Lightbox */}
          {lightboxSrc && (
            <div className={st.lightbox} onClick={() => setLightboxSrc(null)}>
              <button className={st.lbClose} onClick={() => setLightboxSrc(null)}>✕</button>
              <div className={st.lbImgWrap}>
                <Image src={lightboxSrc} alt="Foto besar" fill style={{ objectFit: "contain" }} />
              </div>
            </div>
          )}

          {/* ========== GIFT ========== */}
          <section
            id="gift"
            className={`${isV("gift") ? st.reveal : st.hidden}`}
            style={{ padding: "6rem 2rem", textAlign: "center" }}
            ref={reg("gift")}
          >
            <span className={st.sectionLabel}>Hadiah</span>
            <h2 className={st.sectionH}>Amplop <em>Digital</em></h2>
            <p className={st.sectionSub} style={{ marginBottom: "2.5rem" }}>
              Doa dan kehadiran Anda adalah hadiah terbesar kami. Namun jika ingin memberikan hadiah, silakan kirim melalui:
            </p>
            <div style={{ maxWidth: 560, margin: "0 auto" }}>
              <div className={st.giftTabs}>
                {GIFTS.map((g, i) => (
                  <button
                    key={i}
                    className={`${st.giftTab} ${activeGift === i ? st.giftTabActive : ""}`}
                    onClick={() => { setActiveGift(i); setCopied(false); }}
                  >
                    {g.icon} {g.bank}
                  </button>
                ))}
              </div>
              <div className={st.atmCardWrapper}>
                <div className={`${st.atmCard} ${activeGift === 0 ? st.atmCardStyle1 : st.atmCardStyle2}`}>
                  <div className={st.atmTop}>
                    <div className={st.atmChip}></div>
                    <p className={st.atmBank}>{GIFTS[activeGift].icon} {GIFTS[activeGift].bank}</p>
                  </div>
                  <div className={st.atmMiddle}>
                    <p className={st.atmNum}>{GIFTS[activeGift].num}</p>
                  </div>
                  <div className={st.atmBottom}>
                    <div className={st.atmHolderBox}>
                      <span className={st.atmLabel}>Cardholder</span>
                      <p className={st.atmName}>{GIFTS[activeGift].name}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className={st.atmActions}>
                <button className={st.copyGiftBtn} onClick={() => handleCopy(GIFTS[activeGift].copy)}>
                  {copied ? "✅ Tersalin!" : "📋 Salin Nomor Rekening"}
                </button>
                <p className={st.copySuccess}>{copied ? "Nomor rekening berhasil disalin" : ""}</p>
              </div>
            </div>
          </section>

          {/* ========== RSVP ========== */}
          <section id="rsvp" className={st.rsvpSection} ref={reg("rsvp")}>
            <span className={st.sectionLabel}>Konfirmasi</span>
            <h2 className={st.sectionH}>RSVP & <em>Ucapan</em></h2>
            <p className={st.sectionSub}>Mohon konfirmasi kehadiran Anda sebelum 15 Desember 2026.</p>
            <div className={st.rsvpInner} style={{ marginTop: "3rem" }}>
              {/* Form */}
              <form className={st.rsvpForm} onSubmit={handleSubmit}>
                <p className={st.rsvpFormTitle}>Kirim Ucapan 💌</p>
                <input
                  type="text"
                  placeholder="Nama lengkap Anda"
                  className={st.rsvpInput}
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
                <select
                  className={st.rsvpSelect}
                  value={form.hadir}
                  onChange={(e) => setForm({ ...form, hadir: e.target.value })}
                >
                  <option value="hadir">✅ Hadir</option>
                  <option value="tidak_hadir">Tidak Bisa Hadir</option>
                </select>
                <textarea
                  className={st.rsvpTextarea}
                  placeholder="Tulis ucapan atau doa untuk kami..."
                  value={form.wish}
                  onChange={(e) => setForm({ ...form, wish: e.target.value })}
                  required
                />
                <button
                  id="btn-kirim-ucapan"
                  type="submit"
                  className={`${st.rsvpSubmit} ${submitted ? st.rsvpSubmitOk : ""}`}
                >
                  {submitted ? "✅ Ucapan Terkirim!" : "Kirim Sekarang →"}
                </button>
              </form>
              {/* Wishes Feed */}
              <div className={st.wishesFeed}>
                {wishes.map((w, i) => (
                  <div key={i} className={st.wishItem}>
                    <div className={st.wishHead}>
                      <div className={st.wishAv}>{w.name.charAt(0)}</div>
                      <span className={st.wishAuthor}>{w.name}</span>
                      <span className={st.wishHadir}>
                        {w.hadir === "hadir" ? "✅ Hadir" : "Tidak Hadir"}
                      </span>
                    </div>
                    <p className={st.wishMsg}>{w.wish}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ========== FOOTER ========== */}
          <footer className={st.footer}>
            <span className={st.footerLeaf}>🌿</span>
            <p className={st.footerLabel}>Terima Kasih</p>
            <h2 className={st.footerNames}>Andi <em>&</em> Sari</h2>
            <p className={st.footerDate}>20 · 12 · 2026</p>
            <p className={st.footerThank}>
              Kehadiran dan doa restu Anda adalah anugerah terbesar bagi kami.
              Semoga kebahagiaan senantiasa menyertai Anda sekeluarga.
            </p>
            <p className={st.footerCredit}>Hunters</p>
            <span className={st.footerLeaf}>🌿</span>
          </footer>
        </main>
      )}
    </>
  );
}
