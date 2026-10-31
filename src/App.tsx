import { useEffect, useRef, useState } from 'react';
import { heroPhotos, logo, studioPhotos, workPhotos } from './media';

const link = {
  telegram: 'https://t.me/mayak_tatt',
  vk: 'https://vk.ru/club128462909',
  max: 'https://max.ru/u/f9LHodD0cOK6RbYJy3UMqJs0PVYaTiLDYRuHdHNHdzxfS1PYkvP23jikxHU',
  map: 'https://2gis.ru/geo/141373143520267',
  phone: 'tel:+79833124539',
};
const nav = [['Работы', '#works'], ['Стоимость', '#prices'], ['О коллективе', '#about'], ['Запись', '#booking'], ['Вопросы', '#faq'], ['Контакты', '#contacts']] as const;

function Photo({ src, alt, onLoaded }: { src: string; alt: string; onLoaded?: (value: boolean) => void }) {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { setLoaded(false); onLoaded?.(false); }, [src]);
  return <span className="photo"><img src={src} alt={alt} loading="lazy" className={loaded ? 'is-loaded' : ''} onLoad={() => { setLoaded(true); onLoaded?.(true); }} onError={() => { setLoaded(false); onLoaded?.(false); }} /></span>;
}

function Header() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const escape = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    const resize = () => { if (window.innerWidth > 820) setOpen(false); };
    document.addEventListener('keydown', escape); window.addEventListener('resize', resize);
    return () => { document.removeEventListener('keydown', escape); window.removeEventListener('resize', resize); };
  }, []);
  return <header className="site-header"><div className="shell header-inner">
    <a className="brand" href="#top" aria-label="МАЯК — в начало страницы" onClick={() => setOpen(false)}><img src={logo} alt="МАЯК — Tattoo Collective" /></a>
    <nav id="site-nav" className={`main-nav ${open ? 'is-open' : ''}`} aria-label="Основная навигация">{nav.map(([label, href]) => <a href={href} key={href} onClick={() => setOpen(false)}>{label}</a>)}<a className="nav-contact" href={link.telegram} target="_blank" rel="noreferrer">Написать в Telegram ↗</a></nav>
    <a className="header-cta" href={link.telegram} target="_blank" rel="noreferrer">Записаться ↗</a>
    <button className={`menu-toggle ${open ? 'is-open' : ''}`} type="button" aria-expanded={open} aria-controls="site-nav" aria-label={open ? 'Закрыть меню' : 'Открыть меню'} onClick={() => setOpen(v => !v)}><span /><span /></button>
  </div></header>;
}
function Hero() { return <section className="hero shell" aria-labelledby="hero-title">
  <div className="hero-copy"><p className="eyebrow">НОВОСИБИРСК ／ ТАТУ-КОЛЛЕКТИВ</p><h1 id="hero-title">МАЯК</h1><p className="hero-subtitle">Татуировки<br />со своим почерком.</p><p className="hero-text">Обсудим вашу идею и разработаем индивидуальный эскиз с учётом формы, масштаба и места нанесения.</p><div className="hero-actions"><a className="button button--solid" href="#works">Смотреть работы ↗</a><a className="button button--outline" href={link.telegram} target="_blank" rel="noreferrer">Обсудить татуировку ↗</a></div></div>
  <div className="hero-visual" aria-hidden="true">{heroPhotos.map(src => <Photo key={src} src={src} alt="" />)}</div>
  <div className="hero-baseline"><span>MAYAK TATTOO COLLECTIVE</span><span>12 МАСТЕРОВ · 10 ЛЕТ ВМЕСТЕ</span></div>
</section>; }

function Portfolio() {
  const [available, setAvailable] = useState<number[]>([]);
  const [active, setActive] = useState<number | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  const startX = useRef<number | null>(null);
  const move = (step: number) => setActive(current => {
    if (current === null || !available.length) return current;
    return available[(available.indexOf(current) + step + available.length) % available.length];
  });
  useEffect(() => {
    const keydown = (e: KeyboardEvent) => { if (!dialog.current?.open) return; if (e.key === 'ArrowRight') { e.preventDefault(); move(1); } if (e.key === 'ArrowLeft') { e.preventDefault(); move(-1); } };
    document.addEventListener('keydown', keydown); return () => document.removeEventListener('keydown', keydown);
  }, [available]);
  return <section className="portfolio section-pad" id="works" aria-labelledby="works-title"><div className="shell"><div className="section-heading"><div><p className="eyebrow">01 / ПОРТФОЛИО</p><h2 id="works-title">Работы<br />коллектива</h2></div><p>Авторские татуировки — от небольших деталей до крупных проектов.</p></div>
    <div className="works-grid">{workPhotos.map((work, index) => <button className="work" type="button" key={work.src} disabled={!available.includes(index)} aria-label={`Открыть работу ${work.number}`} onClick={e => { opener.current = e.currentTarget; setActive(index); dialog.current?.showModal(); }}><Photo src={work.src} alt={work.alt} onLoaded={loaded => setAvailable(current => loaded ? current.includes(index) ? current : [...current, index].sort((a, b) => a - b) : current.filter(item => item !== index))} /></button>)}</div>
  </div><dialog className="lightbox" ref={dialog} aria-label="Просмотр работ" onClose={() => { setActive(null); opener.current?.focus(); }} onClick={e => { if (e.target === dialog.current) dialog.current.close(); }}>
    {active !== null && <div className="lightbox-inner" onTouchStart={e => { startX.current = e.touches[0]?.clientX ?? null; }} onTouchEnd={e => { if (startX.current === null) return; const delta = e.changedTouches[0].clientX - startX.current; if (Math.abs(delta) > 50) move(delta < 0 ? 1 : -1); startX.current = null; }}><div className="lightbox-top"><span>МАЯК / {workPhotos[active].number} · {available.length} ФОТО</span><button type="button" onClick={() => dialog.current?.close()}>Закрыть ×</button></div><div className="lightbox-stage"><button type="button" onClick={() => move(-1)} aria-label="Назад">← <span>Назад</span></button><img src={workPhotos[active].src} alt={workPhotos[active].alt} /><button type="button" onClick={() => move(1)} aria-label="Далее"><span>Далее</span> →</button></div><p className="lightbox-hint">Листайте кнопками, стрелками клавиатуры или свайпом</p></div>}
  </dialog></section>;
}
const prices = [['Миниатюрная татуировка', 'от 4 000 ₽'], ['Татуировка среднего размера', 'от 10 000 ₽'], ['Крупный проект', 'от 15 000 ₽ за сеанс']];
function Prices() { return <section className="prices section-pad" id="prices" aria-labelledby="prices-title"><div className="shell prices-grid"><div><p className="eyebrow">02 / СТОИМОСТЬ</p><h2 id="prices-title">Ориентир<br />по цене</h2><p className="prices-note">Точную стоимость определим после обсуждения эскиза, размера и места нанесения.</p></div><div className="price-list">{prices.map(([name, price], i) => <div className="price-row" key={name}><span>0{i + 1}</span><h3>{name}</h3><strong>{price}</strong></div>)}</div></div></section>; }
function About() { return <section className="about section-pad" id="about" aria-labelledby="about-title"><div className="shell about-grid"><div className="about-copy"><p className="eyebrow">03 / О КОЛЛЕКТИВЕ</p><h2 id="about-title">12 мастеров.<br />Один коллектив.</h2><p className="about-lead">За 10 лет совместной деятельности мы реализовали тысячи работ в авторском стиле.</p><p>Создаём татуировки и индивидуальные эскизы, исправляем и перекрываем существующие работы. Начать можно с бесплатной консультации.</p><a className="text-link" href="#booking">Обсудить идею ↗</a></div><div className="studio-grid">{studioPhotos.map(src => <Photo key={src} src={src} alt="Интерьер тату-коллектива МАЯК" />)}</div></div></section>; }

const options = {
  preparation: [{ label: 'Эскиз', value: 'У меня есть эскиз' }, { label: 'Референсы', value: 'У меня есть референсы' }, { label: 'Нужна помощь', value: 'Мне нужна помощь с эскизом' }],
  color: [{ label: 'Цветная', value: 'Интересует цветной вариант' }, { label: 'Чёрно-белая', value: 'Интересует чёрно-белый вариант' }],
  age: [{ label: 'До 18', value: 'Мне меньше 18 лет' }, { label: '18+', value: 'Мне больше 18 лет' }],
};
type AnswerKey = keyof typeof options;
function Booking() {
  const [answers, setAnswers] = useState<Record<AnswerKey, string>>({ preparation: '', color: '', age: '' });
  const ready = Object.values(answers).every(Boolean);
  const message = `Здравствуйте! Хотелось бы записаться на татуировку. ${answers.preparation}. ${answers.color}. ${answers.age}. Подскажите, пожалуйста, есть ли свободное время?`;
  const bookingUrl = `${link.telegram}?text=${encodeURIComponent(message)}`;
  return <section className="booking section-pad" id="booking" aria-labelledby="booking-title"><div className="shell booking-grid"><div className="booking-copy"><p className="eyebrow">04 / ОБРАЩЕНИЕ</p><h2 id="booking-title">С чего<br />начнём?</h2><p>Выберите ответы — мы соберём сообщение и откроем чат коллектива в Telegram.</p></div><div className="booking-form">
    {([['preparation', 'Что уже есть'], ['color', 'Татуировка'], ['age', 'Возраст']] as const).map(([key, label], i) => <fieldset key={key}><legend><span>0{i + 1}</span>{label}</legend><div className="option-list">{options[key].map(option => <button type="button" key={option.label} className={answers[key] === option.value ? 'is-selected' : ''} aria-pressed={answers[key] === option.value} onClick={() => setAnswers(v => ({ ...v, [key]: option.value }))}>{option.label}</button>)}</div></fieldset>)}
    {ready ? <a className="button button--solid booking-submit" href={bookingUrl} target="_blank" rel="noopener noreferrer">Открыть Telegram ↗</a> : <button className="button button--solid booking-submit" type="button" disabled>Выберите ответы</button>}
  </div></div></section>;
}
const questions = [
  ['Можно ли прийти на консультацию?', 'Да, консультация бесплатная. Напишите нам в Telegram, чтобы договориться о времени.'],
  ['Можно ли исправить или перекрыть татуировку?', 'Да, коллектив занимается исправлением и перекрытием татуировок. Возможность работы обсудим на консультации.'],
  ['Как узнать точную стоимость?', 'Она зависит от эскиза, размера и места нанесения. Обсудим детали и назовём стоимость перед записью.'],
  ['Когда вы работаете?', 'Ежедневно с 11:00 до 20:00, по предварительной записи.'],
];
function FAQ() { const [open, setOpen] = useState<number[]>([]); return <section className="faq section-pad" id="faq" aria-labelledby="faq-title"><div className="shell faq-grid"><div><p className="eyebrow">05 / ВОПРОСЫ</p><h2 id="faq-title">Перед<br />визитом</h2></div><div>{questions.map(([q, a], i) => { const expanded = open.includes(i); return <div className={`faq-item ${expanded ? 'is-open' : ''}`} key={q}><button type="button" aria-expanded={expanded} aria-controls={`faq-answer-${i}`} onClick={() => setOpen(v => expanded ? v.filter(item => item !== i) : [...v, i])}><span>{q}</span><span aria-hidden="true">{expanded ? '−' : '+'}</span></button><div className="faq-answer" id={`faq-answer-${i}`} aria-hidden={!expanded}><div><p>{a}</p></div></div></div>; })}</div></div></section>; }
function Contacts() { return <section className="contacts section-pad" id="contacts" aria-labelledby="contacts-title"><div className="shell contacts-grid"><div><p className="eyebrow">06 / КОНТАКТЫ</p><h2 id="contacts-title">Ждём вас<br />на Фрунзе, 71.</h2><a className="button button--solid" href={link.telegram} target="_blank" rel="noreferrer">Написать в Telegram ↗</a></div><div className="contact-details"><div><span>АДРЕС</span><p>Новосибирск, улица Фрунзе, 71, 1 этаж</p><a href={link.map} target="_blank" rel="noreferrer">Открыть на карте ↗</a></div><div><span>ГРАФИК</span><p>Ежедневно с 11:00 до 20:00<br />По предварительной записи</p></div><div><span>ТЕЛЕФОН</span><a className="phone" href={link.phone}>+7 (983) 312-45-39</a></div><div><span>СВЯЗЬ</span><div className="socials"><a href={link.telegram} target="_blank" rel="noreferrer">Telegram ↗</a><a href={link.vk} target="_blank" rel="noreferrer">VK ↗</a><a href={link.max} target="_blank" rel="noreferrer">MAX ↗</a></div></div></div></div></section>; }
function Footer() { return <footer className="footer"><div className="shell footer-main"><a href="#top" aria-label="МАЯК — наверх"><img src={logo} alt="МАЯК — Tattoo Collective" /></a><p>Тату-коллектив<br />в Новосибирске</p><a href="#top">Наверх ↑</a></div><div className="shell footer-bottom"><span>© {new Date().getFullYear()} МАЯК</span><span>MAYAK TATTOO COLLECTIVE</span><span>Новосибирск · Фрунзе, 71</span></div></footer>; }
function App() { return <><a className="skip-link" href="#works">Перейти к содержанию</a><div id="top" /><Header /><main><Hero /><Portfolio /><Prices /><About /><Booking /><FAQ /><Contacts /></main><Footer /></>; }
export default App;
