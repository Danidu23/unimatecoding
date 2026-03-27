import { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../api/axios";
import {
  ArrowLeft, ShoppingCart, Search, Clock, Star, Plus, Minus,
  X, MapPin, Timer, ChevronRight, CheckCircle, Bell, User,
  UtensilsCrossed, Zap, Coffee, Beef, Soup, Layers, Package,
  Flame, Leaf, Award, CupSoda,
  Banknote, HandCoins, Copy, Clock3, ChefHat, PackageCheck, Bike, AlertTriangle, Trash2
} from "lucide-react";
import unimateLogo from "../assets/unimatelogo.png";

/* ─────────────────────────────────────────────────────────────────────────────
   CSS — 100% dark Dashboard theme
───────────────────────────────────────────────────────────────────────────── */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800;900&family=DM+Sans:ital,wght@0,400;0,500;0,600;1,400&display=swap');

  *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
  html, body, #root { width:100%; max-width:100%; overflow-x:hidden; scroll-behavior:smooth; }
  body { font-family:'DM Sans',system-ui,sans-serif; background:#07091a; }
  a { text-decoration:none; }
  button { font-family:inherit; cursor:pointer; border:none; }
  ::-webkit-scrollbar { width:5px; }
  ::-webkit-scrollbar-track { background:#07091a; }
  ::-webkit-scrollbar-thumb { background:#F5A623; border-radius:3px; }

  @keyframes fadeUp        { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeIn        { from{opacity:0} to{opacity:1} }
  @keyframes float         { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
  @keyframes glow          { 0%,100%{opacity:.4} 50%{opacity:.9} }
  @keyframes shimmer       { 0%{background-position:200% center} 100%{background-position:-200% center} }
  @keyframes pulse         { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.18);opacity:.8} }
  @keyframes slideInRight  { from{transform:translateX(110%);opacity:0} to{transform:translateX(0);opacity:1} }
  @keyframes slideInUp     { from{transform:translateY(100%);opacity:0} to{transform:translateY(0);opacity:1} }
  @keyframes popIn         { from{transform:scale(.65);opacity:0} to{transform:scale(1);opacity:1} }
  @keyframes wiggle        { 0%,100%{transform:rotate(0)} 25%{transform:rotate(-10deg)} 75%{transform:rotate(10deg)} }

  /* ── Navbar ── */
  .c-nav {
    position:fixed; top:0; left:0; right:0; z-index:400;
    background:rgba(7,9,26,.97); backdrop-filter:blur(18px);
    border-bottom:1px solid rgba(255,255,255,.07);
    display:flex; align-items:center; justify-content:space-between;
    padding:0 clamp(16px,4vw,60px); height:66px;
    transition:border-color .4s, box-shadow .4s;
  }
  .c-nav.scrolled {
    border-bottom-color:rgba(245,166,35,.2);
    box-shadow:0 6px 40px rgba(0,0,0,.5);
  }
  .nav-lnk {
    color:rgba(255,255,255,.6); font-size:14px; font-weight:600;
    font-family:'Manrope',sans-serif; padding:4px 0;
    position:relative; transition:color .2s; text-decoration:none;
  }
  .nav-lnk::after {
    content:''; position:absolute; bottom:-3px; left:0; right:0;
    height:2px; background:#F5A623; border-radius:2px;
    transform:scaleX(0); transform-origin:left; transition:transform .25s;
  }
  .nav-lnk:hover { color:#fff; }
  .nav-lnk:hover::after { transform:scaleX(1); }
  .nav-lnk.active { color:#F5A623; }
  .nav-lnk.active::after { transform:scaleX(1); }

  /* ── Buttons ── */
  .btn-back {
    display:inline-flex; align-items:center; gap:6px;
    background:rgba(255,255,255,.07); border:1px solid rgba(255,255,255,.13);
    border-radius:9px; padding:7px 14px;
    color:rgba(255,255,255,.75); font-size:13px; font-weight:600;
    cursor:pointer; transition:all .22s;
  }
  .btn-back:hover { background:rgba(245,166,35,.12); border-color:rgba(245,166,35,.3); color:#F5A623; }

  .btn-primary {
    display:inline-flex; align-items:center; gap:8px;
    background:#F5A623; color:#07091a; border:none; border-radius:10px;
    padding:13px 26px; font-size:14px; font-weight:800;
    font-family:'Manrope',sans-serif; cursor:pointer;
    transition:transform .22s, box-shadow .22s, background .22s;
    box-shadow:0 4px 20px rgba(245,166,35,.38);
    position:relative; overflow:hidden;
  }
  .btn-primary::after {
    content:''; position:absolute; inset:0;
    background:linear-gradient(110deg,transparent 30%,rgba(255,255,255,.25) 50%,transparent 70%);
    transform:translateX(-100%); transition:transform .5s;
  }
  .btn-primary:hover { transform:translateY(-2px); background:#f9ba3c; box-shadow:0 8px 28px rgba(245,166,35,.55); }
  .btn-primary:hover::after { transform:translateX(100%); }

  /* ── Icon button ── */
  .icon-btn {
    background:none; border:none; color:rgba(255,255,255,.55);
    width:38px; height:38px; border-radius:10px;
    display:flex; align-items:center; justify-content:center;
    cursor:pointer; transition:background .2s, color .2s; position:relative;
  }
  .icon-btn:hover { background:rgba(255,255,255,.09); color:#fff; }
  .badge {
    position:absolute; top:-5px; right:-5px;
    min-width:18px; height:18px; padding:0 4px;
    background:#F5A623; color:#07091a; border-radius:100px;
    font-size:10px; font-weight:900; font-family:'Manrope',sans-serif;
    display:flex; align-items:center; justify-content:center;
    animation:popIn .3s cubic-bezier(.22,.68,0,1.2);
  }

  /* ── Canteen selector cards ── */
  .canteen-row {
    background:rgba(255,255,255,.04);
    border:1.5px solid rgba(255,255,255,.08);
    border-radius:20px; overflow:hidden;
    display:flex; cursor:pointer; min-height:190px;
    transition:all .3s cubic-bezier(.22,.68,0,1.2);
    box-shadow:0 2px 20px rgba(0,0,0,.2);
  }
  .canteen-row:hover {
    border-color:rgba(245,166,35,.45);
    background:rgba(245,166,35,.04);
    transform:translateY(-4px);
    box-shadow:0 12px 48px rgba(245,166,35,.12);
  }
  .canteen-row img { width:clamp(140px,26%,210px); height:100%; object-fit:cover; flex-shrink:0; transition:transform .45s; }
  .canteen-row:hover img { transform:scale(1.05); }

  /* ── Category pills ── */
  .cat-scroll { display:flex; gap:8px; overflow-x:auto; padding:2px 0 4px; scrollbar-width:none; }
  .cat-scroll::-webkit-scrollbar { display:none; }
  .cat-pill {
    display:inline-flex; align-items:center; gap:7px;
    padding:9px 18px; border-radius:100px; font-size:13px; font-weight:700;
    font-family:'Manrope',sans-serif; cursor:pointer; white-space:nowrap; flex-shrink:0;
    border:1.5px solid rgba(255,255,255,.1);
    background:rgba(255,255,255,.05); color:rgba(255,255,255,.65);
    transition:all .22s;
  }
  .cat-pill:hover { border-color:rgba(245,166,35,.4); color:#F5A623; background:rgba(245,166,35,.07); }
  .cat-pill.active { background:#F5A623; color:#07091a; border-color:#F5A623; box-shadow:0 4px 18px rgba(245,166,35,.4); }

  /* ── Menu item ── */
  .menu-item {
    display:flex; align-items:center; gap:16px;
    padding:18px 20px; border-bottom:1px solid rgba(255,255,255,.06);
    transition:background .18s;
  }
  .menu-item:last-child { border-bottom:none; }
  .menu-item:hover { background:rgba(245,166,35,.03); }
  .menu-item-img {
    width:96px; height:96px; border-radius:14px; object-fit:cover;
    flex-shrink:0; border:1px solid rgba(255,255,255,.08);
    transition:transform .3s;
  }
  .menu-item:hover .menu-item-img { transform:scale(1.04); }

  /* ── Add / qty ── */
  .add-btn {
    width:34px; height:34px; border-radius:50%; background:#F5A623;
    border:none; color:#07091a; display:flex; align-items:center; justify-content:center;
    cursor:pointer; flex-shrink:0;
    transition:transform .22s, box-shadow .22s;
    box-shadow:0 2px 10px rgba(245,166,35,.4);
  }
  .add-btn:hover { transform:scale(1.15) rotate(90deg); box-shadow:0 4px 18px rgba(245,166,35,.55); }
  .qty-row { display:flex; align-items:center; gap:10px; flex-shrink:0; }
  .qty-btn {
    width:30px; height:30px; border-radius:50%; border:none;
    display:flex; align-items:center; justify-content:center;
    cursor:pointer; font-weight:800; transition:transform .18s, background .18s;
  }
  .qty-btn:hover { transform:scale(1.14); }
  .qty-minus { background:rgba(255,255,255,.1); color:#fff; }
  .qty-minus:hover { background:rgba(239,68,68,.2); color:#f87171; }
  .qty-plus  { background:#F5A623; color:#07091a; box-shadow:0 2px 8px rgba(245,166,35,.3); }
  .qty-plus:hover  { background:#f9ba3c; }

  /* ── Tags ── */
  .tag { display:inline-flex; align-items:center; gap:3px; padding:2px 8px; border-radius:100px; font-size:10px; font-weight:700; font-family:'Manrope',sans-serif; }
  .tag-spicy { background:rgba(239,68,68,.15);  color:#f87171; }
  .tag-veg   { background:rgba(34,197,94,.15);  color:#4ade80; }
  .tag-pop   { background:rgba(245,166,35,.15); color:#F5A623; }
  .tag-new   { background:rgba(96,165,250,.15); color:#60a5fa; }

  /* ── Search ── */
  .search-wrap {
    display:flex; align-items:center; gap:10px;
    background:rgba(255,255,255,.06); border:1.5px solid rgba(255,255,255,.1);
    border-radius:12px; padding:10px 16px;
    transition:border-color .22s, background .22s;
  }
  .search-wrap:focus-within { border-color:rgba(245,166,35,.5); background:rgba(245,166,35,.05); }
  .search-wrap input { background:none; border:none; outline:none; color:#fff; font-size:14px; font-family:'DM Sans',sans-serif; width:100%; }
  .search-wrap input::placeholder { color:rgba(255,255,255,.35); }

  /* ── Cart panel ── */
  .cart-panel {
    position:fixed; top:0; right:0; bottom:0; width:min(400px,100vw);
    background:#0d1130; border-left:1px solid rgba(255,255,255,.08);
    z-index:500; display:flex; flex-direction:column;
    animation:slideInRight .35s cubic-bezier(.22,.68,0,1.2);
    box-shadow:-16px 0 80px rgba(0,0,0,.6);
  }
  .cart-overlay { position:fixed; inset:0; background:rgba(0,0,0,.6); z-index:490; backdrop-filter:blur(4px); animation:fadeIn .25s; }
  .cart-item { display:flex; align-items:center; gap:12px; padding:14px 0; border-bottom:1px solid rgba(255,255,255,.06); animation:fadeUp .3s both; }
  .cart-item:last-child { border-bottom:none; }

  /* ── Floating cart ── */
  .float-cart {
    position:fixed; bottom:28px; left:50%; transform:translateX(-50%);
    background:#F5A623; color:#07091a; border:none; border-radius:16px;
    padding:14px 28px; display:flex; align-items:center; gap:12px;
    font-size:15px; font-weight:800; font-family:'Manrope',sans-serif;
    cursor:pointer; z-index:300; white-space:nowrap;
    box-shadow:0 8px 40px rgba(245,166,35,.55);
    animation:slideInUp .4s cubic-bezier(.22,.68,0,1.2);
    transition:transform .22s, box-shadow .22s;
  }
  .float-cart:hover { transform:translateX(-50%) translateY(-3px); box-shadow:0 14px 52px rgba(245,166,35,.7); }

  /* ── Section divider ── */
  .sec-head { display:flex; align-items:center; gap:12px; margin-bottom:20px; }
  .sec-line  { flex:1; height:1px; background:rgba(255,255,255,.08); }

  /* ── Status dots ── */
  .dot-open   { width:7px; height:7px; border-radius:50%; background:#22c55e; display:inline-block; animation:pulse 2s infinite; }
  .dot-closed { width:7px; height:7px; border-radius:50%; background:#ef4444; display:inline-block; }

  /* ── Modal ── */
  .modal-bg { position:fixed; inset:0; background:rgba(0,0,0,.75); z-index:600; display:flex; align-items:center; justify-content:center; backdrop-filter:blur(8px); animation:fadeIn .28s; padding:20px; }
  .modal { background:#0d1130; border:1.5px solid rgba(245,166,35,.2); border-radius:28px; max-width:440px; width:100%; overflow:hidden; animation:popIn .36s cubic-bezier(.22,.68,0,1.2); box-shadow:0 24px 80px rgba(0,0,0,.6); }

  /* ── Responsive ── */

  /* ── Payment option cards ── */
  .pay-opt {
    display:flex; align-items:center; gap:14px;
    padding:14px 16px; border-radius:14px;
    border:1.5px solid rgba(255,255,255,.1);
    background:rgba(255,255,255,.04); cursor:pointer;
    transition:all .22s; margin-bottom:10px;
  }
  .pay-opt:hover { border-color:rgba(245,166,35,.4); background:rgba(245,166,35,.05); }
  .pay-opt.selected { border-color:#F5A623; background:rgba(245,166,35,.1); }
  .pay-opt-icon {
    width:42px; height:42px; border-radius:12px;
    background:rgba(255,255,255,.07); display:flex; align-items:center; justify-content:center;
    flex-shrink:0; transition:background .22s;
  }
  .pay-opt.selected .pay-opt-icon { background:#F5A623; }
  .pay-opt.selected .pay-opt-icon svg { color:#07091a !important; stroke:#07091a !important; }

  /* ── Tracking timeline ── */
  .track-step {
    display:flex; gap:16px; position:relative;
  }
  .track-step:not(:last-child)::before {
    content:''; position:absolute; left:17px; top:38px;
    width:2px; bottom:-8px;
    background:rgba(255,255,255,.1);
  }
  .track-step.done::before { background:rgba(245,166,35,.4); }
  .track-dot {
    width:30px; height:30px; border-radius:50%; flex-shrink:0;
    display:flex; align-items:center; justify-content:center;
    border:2px solid rgba(255,255,255,.15); background:#07091a;
    transition:all .4s;
  }
  .track-dot.done { background:#F5A623; border-color:#F5A623; }
  .track-dot.active { background:#07091a; border-color:#F5A623; box-shadow:0 0 0 4px rgba(245,166,35,.2); animation:pulse 2s infinite; }
  .track-dot.done svg { color:#07091a !important; stroke:#07091a !important; }
  .track-dot.active svg { color:#F5A623 !important; stroke:#F5A623 !important; }

  @keyframes trackReveal { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }


  /* ── Cancel order ── */
  .btn-cancel {
    display:inline-flex; align-items:center; gap:7px;
    width:100%; justify-content:center;
    background:rgba(239,68,68,.08); border:1.5px solid rgba(239,68,68,.2);
    color:#f87171; border-radius:10px;
    padding:8px; font-size:12px; font-weight:700;
    font-family:'Manrope',sans-serif; cursor:pointer;
    transition:all .22s; margin-top:8px;
  }
  .btn-cancel:hover { background:rgba(239,68,68,.15); border-color:rgba(239,68,68,.4); color:#fca5a5; transform:translateY(-1px); }

  /* ── Cancel confirm dialog ── */
  .cancel-dialog {
    background:#0d1130; border:1.5px solid rgba(239,68,68,.25);
    border-radius:22px; max-width:360px; width:100%;
    animation:popIn .3s cubic-bezier(.22,.68,0,1.2);
    overflow:hidden; box-shadow:0 20px 60px rgba(0,0,0,.6);
  }

  @media (max-width:768px) {
    .desktop-nav { display:none !important; }
    .canteen-row { flex-direction:column; }
    .canteen-row img { width:100% !important; height:200px; }
    .menu-item-img { width:76px !important; height:76px !important; }
    .cart-panel { width:100vw !important; }
  }
  @media (max-width:480px) {
    .menu-item-img { width:64px !important; height:64px !important; }
    .menu-item { padding:14px 16px; }
  }
`;

/* ─────────────────────────────────────────────────────────────────────────────
   DATA
───────────────────────────────────────────────────────────────────────────── */
const CANTEENS = [
  {
    id: 1,
    name: "Main Canteen",
    subtitle: "Sri Lankan meals · Rice · Kottu · Fried Rice",
    location: "Ground Floor, Block A",
    status: "open",
    rating: 4.8, reviews: 214,
    waitTime: "10–15 min",
    priceRange: "Rs. 40 – 400",
    desc: "The main campus canteen serving hot Sri Lankan meals daily. Fresh, affordable and made to order.",
    img: "https://images.unsplash.com/photo-1567521464027-f127ff144326?w=800&q=80",
    tags: ["Most Popular"],
  },
  {
    id: 2,
    name: "24 Basement Canteen",
    subtitle: "Quick bites · Snacks · Short eats · Beverages",
    location: "Basement, Block B",
    status: "open",
    rating: 4.5, reviews: 138,
    waitTime: "5–10 min",
    priceRange: "Rs. 30 – 300",
    desc: "Fast service basement canteen perfect for quick snacks and meals between classes.",
    img: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=80",
    tags: ["Quick Service"],
  },
];

const MENU = [
  {
    category: "Rice & Curry", icon: <UtensilsCrossed size={14}/>,
    items: [
      { id:1,  name:"Rice & 3 Curries",       price:220, rating:4.9, img:"https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&q=80", tags:["pop","veg"], desc:"Steamed rice with dhal, potato curry & coconut sambol", cal:520, time:"8 min" },
      { id:2,  name:"Rice & Chicken Curry",    price:280, rating:4.8, img:"https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&q=80", tags:["pop"],       desc:"Steamed rice with rich Sri Lankan chicken curry",         cal:560, time:"10 min" },
      { id:3,  name:"Rice & Fish Curry",       price:260, rating:4.7, img:"https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&q=80", tags:[],            desc:"Steamed rice with spiced Sri Lankan fish curry",         cal:490, time:"8 min" },
      { id:4,  name:"String Hoppers & Curry",  price:200, rating:4.6, img:"https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&q=80", tags:["veg"],       desc:"Soft string hoppers with coconut milk curry",           cal:380, time:"10 min" },
    ]
  },
  {
    category: "Kottu", icon: <Zap size={14}/>,
    items: [
      { id:5,  name:"Chicken Kottu",           price:350, rating:4.9, img:"https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&q=80", tags:["pop","spicy"], desc:"Classic kottu with chicken, egg & vegetables",        cal:620, time:"12 min" },
      { id:6,  name:"Egg Kottu",               price:280, rating:4.7, img:"https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&q=80", tags:["pop"],          desc:"Chopped roti with fluffy egg & mixed vegetables",    cal:540, time:"10 min" },
      { id:7,  name:"Cheese Kottu",            price:380, rating:4.8, img:"https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80", tags:["new"],          desc:"Kottu loaded with melted cheese & vegetables",       cal:680, time:"12 min" },
      { id:8,  name:"Mixed Kottu",             price:400, rating:4.9, img:"https://images.unsplash.com/photo-1574484284002-952d92456975?w=400&q=80", tags:["pop","spicy"], desc:"Chicken, egg & cheese kottu — the full works",       cal:720, time:"14 min" },
    ]
  },
  {
    category: "Fried Rice", icon: <UtensilsCrossed size={14}/>,
    items: [
      { id:9,  name:"Chicken Fried Rice",      price:300, rating:4.8, img:"https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400&q=80", tags:["pop"],         desc:"Wok-fried rice with chicken, egg & soy sauce",     cal:480, time:"10 min" },
      { id:10, name:"Egg Fried Rice",          price:240, rating:4.6, img:"https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&q=80", tags:["veg"],         desc:"Light fried rice with egg & fresh vegetables",     cal:420, time:"8 min" },
      { id:11, name:"Mixed Fried Rice",        price:340, rating:4.7, img:"https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&q=80", tags:["pop","spicy"], desc:"Chicken, prawn & egg wok-fried with house sauces",  cal:520, time:"12 min" },
      { id:12, name:"Vegetable Fried Rice",    price:220, rating:4.4, img:"https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&q=80", tags:["veg"],         desc:"Seasonal vegetables stir-fried with fragrant rice", cal:360, time:"8 min" },
    ]
  },
  {
    category: "Additional Curries", icon: <Soup size={14}/>,
    items: [
      { id:13, name:"Dhal Curry",              price:60,  rating:4.5, img:"https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&q=80", tags:["veg"],        desc:"Creamy red lentil curry with tempered spices",  cal:140, time:"–" },
      { id:14, name:"Potato Curry",            price:70,  rating:4.4, img:"https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80", tags:["veg","pop"],  desc:"Spiced potato curry in coconut milk gravy",     cal:160, time:"–" },
      { id:15, name:"Green Bean Curry",        price:65,  rating:4.3, img:"https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&q=80", tags:["veg"],        desc:"Fresh beans cooked with turmeric & coconut",    cal:110, time:"–" },
      { id:16, name:"Coconut Sambol",          price:40,  rating:4.8, img:"https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&q=80", tags:["veg","pop"],  desc:"Freshly grated coconut with chilli & lime",     cal:90,  time:"–" },
      { id:17, name:"Fish Ambul Thiyal",       price:120, rating:4.7, img:"https://images.unsplash.com/photo-1574484284002-952d92456975?w=400&q=80", tags:["spicy"],      desc:"Sour & spicy dry fish curry — a Sri Lankan classic", cal:180, time:"–" },
    ]
  },
  {
    category: "Meats", icon: <Beef size={14}/>,
    items: [
      { id:18, name:"Grilled Chicken (Half)",  price:380, rating:4.9, img:"https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400&q=80", tags:["pop"],         desc:"Herb-marinated half chicken, chargrilled to order", cal:440, time:"15 min" },
      { id:19, name:"Fried Chicken (3 pcs)",   price:320, rating:4.8, img:"https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&q=80", tags:["pop","spicy"], desc:"Crispy Sri Lankan style fried chicken pieces",       cal:520, time:"12 min" },
      { id:20, name:"Beef Curry",              price:350, rating:4.7, img:"https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&q=80", tags:["spicy"],        desc:"Slow-cooked beef in rich spiced curry sauce",        cal:480, time:"–" },
      { id:21, name:"Sausage Fry",             price:180, rating:4.4, img:"https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80", tags:[],              desc:"Pan-fried sausages with chilli & onion",             cal:320, time:"8 min" },
    ]
  },
  {
    category: "Chopsuey & Sides", icon: <Zap size={14}/>,
    items: [
      { id:22, name:"Chicken Choupsy",         price:320, rating:4.8, img:"https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&q=80", tags:["pop","spicy"], desc:"Crispy noodles with chicken in sweet chilli sauce", cal:560, time:"12 min" },
      { id:23, name:"Vegetable Choupsy",       price:260, rating:4.5, img:"https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&q=80", tags:["veg","pop"],  desc:"Crispy noodles with mixed vegetables & soy sauce",  cal:440, time:"10 min" },
      { id:24, name:"Spring Rolls (4 pcs)",    price:200, rating:4.6, img:"https://images.unsplash.com/photo-1548507019-c2f82940a537?w=400&q=80", tags:["pop","spicy"], desc:"Crispy rolls with chicken & vegetable filling",      cal:280, time:"8 min" },
      { id:25, name:"Samosa (3 pcs)",          price:150, rating:4.4, img:"https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&q=80", tags:["veg","spicy"], desc:"Golden pastry with spiced potato & peas",            cal:240, time:"5 min" },
      { id:26, name:"Papadam",                 price:30,  rating:4.3, img:"https://images.unsplash.com/photo-1574484284002-952d92456975?w=400&q=80", tags:["veg"],        desc:"Crispy thin lentil wafers, lightly salted",          cal:60,  time:"–" },
    ]
  },
  {
    category: "Beverages", icon: <CupSoda size={14}/>,
    items: [
      { id:27, name:"Fresh Orange Juice",      price:120, rating:4.7, img:"https://images.unsplash.com/photo-1613478223719-2ab802602423?w=400&q=80", tags:["veg","new"],  desc:"100% freshly squeezed orange juice",          cal:95,  time:"3 min" },
      { id:28, name:"Iced Milo",               price:90,  rating:4.5, img:"https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&q=80", tags:["pop"],        desc:"Chilled Milo with ice & condensed milk",      cal:180, time:"2 min" },
      { id:29, name:"Lassi",                   price:100, rating:4.6, img:"https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&q=80", tags:["veg"],        desc:"Sweet yoghurt drink with rose & cardamom",    cal:150, time:"3 min" },
      { id:30, name:"Iced Coffee",             price:150, rating:4.8, img:"https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&q=80", tags:["new"],        desc:"Cold brew with milk & vanilla syrup",         cal:140, time:"4 min" },
      { id:31, name:"Plain Tea",               price:40,  rating:4.4, img:"https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&q=80", tags:["pop","veg"],  desc:"Ceylon black tea, freshly brewed",            cal:5,   time:"2 min" },
    ]
  },
];

const CATEGORY_LABELS = {
  rice_curry: "Rice & Curry",
  kottu: "Kottu",
  fried_rice: "Fried Rice",
  additional_curries: "Additional Curries",
  meats: "Meats",
  chopsuey_sides: "Chopsuey & Sides",
  beverages: "Beverages",
};

const CATEGORY_ORDER = [
  "rice_curry",
  "kottu",
  "fried_rice",
  "additional_curries",
  "meats",
  "chopsuey_sides",
  "beverages",
];

const BACKEND_TAG_TO_UI = {
  popular: "pop",
  veg: "veg",
  spicy: "spicy",
  new: "new",
  "best seller": "pop",
  bestseller: "pop",
  "chef's pick": "new",
  "chef pick": "new",
};

const CATEGORY_ICONS = {
  "Rice & Curry": <UtensilsCrossed size={14}/> ,
  "Kottu": <Zap size={14}/> ,
  "Fried Rice": <UtensilsCrossed size={14}/> ,
  "Additional Curries": <Soup size={14}/> ,
  "Meats": <Beef size={14}/> ,
  "Chopsuey & Sides": <Zap size={14}/> ,
  "Beverages": <CupSoda size={14}/> ,
};

const MENU_ITEM_META = MENU.flatMap(section =>
  section.items.map(item => ({
    ...item,
    category: section.category,
  }))
).reduce((acc, item) => {
  acc[item.name.toLowerCase()] = item;
  return acc;
}, {});

const FALLBACK_ITEM_IMAGE = "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&q=80";

function normalizeBackendTags(tags = []) {
  return tags
    .map(tag => BACKEND_TAG_TO_UI[String(tag).trim().toLowerCase()])
    .filter(Boolean);
}

function transformBackendMenu(items = []) {
  const grouped = CATEGORY_ORDER.map((categoryKey) => ({
    category: CATEGORY_LABELS[categoryKey],
    icon: CATEGORY_ICONS[CATEGORY_LABELS[categoryKey]],
    items: [],
  }));

  items.forEach((item) => {
    const groupIndex = CATEGORY_ORDER.indexOf(item.category);
    if (groupIndex === -1) return;

    const meta = MENU_ITEM_META[item.name?.toLowerCase()] || {};

    grouped[groupIndex].items.push({
      id: item._id,
      name: item.name,
      price: item.price,
      rating: meta.rating || 4.5,
      img: meta.img || FALLBACK_ITEM_IMAGE,
      tags: normalizeBackendTags(item.tags),
      isAvailable: item.isAvailable !== false,
      desc: item.description || meta.desc || "Freshly prepared item from the main canteen.",
      cal: meta.cal,
      time: meta.time || "8 min",
    });
  });

  grouped.forEach((group) => {
    group.items.sort((a, b) => {
      const aPopular = a.tags.includes("pop") ? 1 : 0;
      const bPopular = b.tags.includes("pop") ? 1 : 0;

      if (aPopular !== bPopular) {
        return bPopular - aPopular;
      }

      return a.name.localeCompare(b.name);
    });
  });

  return grouped.filter(group => group.items.length > 0);
}

const TAGS = {
  spicy: { label:<><Flame size={9}/> Spicy</>,    cls:"tag-spicy" },
  veg:   { label:<><Leaf  size={9}/> Veg</>,      cls:"tag-veg"   },
  pop:   { label:<><Award size={9}/> Popular</>,  cls:"tag-pop"   },
  new:   { label:<><Zap   size={9}/> New</>,      cls:"tag-new"   },
};

/* ─────────────────────────────────────────────────────────────────────────────
   NAVBAR
───────────────────────────────────────────────────────────────────────────── */
function Navbar({ cartCount, onCartOpen }) {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <nav className={`c-nav${scrolled ? " scrolled" : ""}`}>
      {/* Logo + back */}
      <div style={{ display:"flex", alignItems:"center", gap:"14px" }}>
        <button className="btn-back" onClick={() => navigate("/dashboard")}>
          <ArrowLeft size={14}/> Back
        </button>
        <div style={{ width:"1px", height:"22px", background:"rgba(255,255,255,.12)" }}/>
        <img src={unimateLogo} alt="Unimate"
          style={{ height:"36px", width:"auto", objectFit:"contain" }}
          onError={e => { e.target.style.display="none"; e.target.nextSibling.style.display="block"; }}
        />
        <span style={{ display:"none", fontWeight:900, fontSize:"20px", fontFamily:"Manrope,sans-serif", color:"#fff", letterSpacing:"-0.4px" }}>
          Uni<span style={{ color:"#F5A623" }}>mate</span>
        </span>
      </div>

      {/* Nav links */}
      <div className="desktop-nav" style={{ display:"flex", gap:"clamp(18px,3vw,32px)" }}>
        {["Dashboard","Canteen","Lost & Found","Sports","Clubs","Orders"].map((item,i) => (
          <a key={i} href="#" className={`nav-lnk${item==="Canteen"?" active":""}`}
            onClick={e => { e.preventDefault(); if(item==="Dashboard") navigate("/dashboard"); }}>
            {item}
          </a>
        ))}
      </div>

      {/* Actions */}
      <div style={{ display:"flex", alignItems:"center", gap:"4px" }}>
        <button className="icon-btn"><Bell size={19}/></button>
        <button className="icon-btn" onClick={onCartOpen} style={{ position:"relative" }}>
          <ShoppingCart size={19}/>
          {cartCount > 0 && <span className="badge">{cartCount}</span>}
        </button>
        <div style={{
          width:"38px", height:"38px", borderRadius:"50%", background:"#F5A623",
          display:"flex", alignItems:"center", justifyContent:"center",
          marginLeft:"8px", cursor:"pointer",
          transition:"transform .25s, box-shadow .25s",
          boxShadow:"0 2px 14px rgba(245,166,35,.4)"
        }}
          onClick={() => navigate("/profile")}
          onMouseOver={e => { e.currentTarget.style.transform="scale(1.12)"; e.currentTarget.style.boxShadow="0 4px 22px rgba(245,166,35,.65)"; }}
          onMouseOut={e =>  { e.currentTarget.style.transform="scale(1)";    e.currentTarget.style.boxShadow="0 2px 14px rgba(245,166,35,.4)"; }}
        >
          <User size={18} color="#07091a"/>
        </div>
      </div>
    </nav>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   CANTEEN SELECTOR
───────────────────────────────────────────────────────────────────────────── */
function CanteenSelector({ onSelect }) {
  const today = new Date().toLocaleDateString("en-US", { weekday:"long", month:"long", day:"numeric" });

  return (
    <div style={{ width:"100%", minHeight:"calc(100vh - 66px)", background:"#07091a" }}>

      {/* ── Hero banner ── */}
      <div style={{
        background:"linear-gradient(135deg,#07091a 0%,#0c1130 55%,#14193a 100%)",
        padding:"52px clamp(20px,6vw,60px) 48px",
        position:"relative", overflow:"hidden", borderBottom:"1px solid rgba(255,255,255,.06)"
      }}>
        {/* Ambient orb */}
        <div style={{ position:"absolute", top:"0%", left:"40%", width:"600px", height:"280px", background:"radial-gradient(ellipse,rgba(245,166,35,.09) 0%,transparent 68%)", animation:"glow 5s ease-in-out infinite", pointerEvents:"none" }}/>
        {/* Left amber accent */}
        <div style={{ position:"absolute", left:0, top:0, bottom:0, width:"4px", background:"linear-gradient(to bottom,#F5A623,rgba(245,166,35,.2))" }}/>

        <div style={{ maxWidth:"1100px", margin:"0 auto", position:"relative" }}>
          {/* Breadcrumb */}
          <div style={{ display:"flex", alignItems:"center", gap:"6px", marginBottom:"24px", fontSize:"12px", color:"rgba(255,255,255,.35)", fontFamily:"Manrope,sans-serif" }}>
            <span style={{ cursor:"pointer", transition:"color .2s" }}
              onMouseOver={e => e.currentTarget.style.color="rgba(255,255,255,.7)"}
              onMouseOut={e =>  e.currentTarget.style.color="rgba(255,255,255,.35)"}
            >Home</span>
            <ChevronRight size={12}/>
            <span style={{ color:"#F5A623", fontWeight:600 }}>Canteen</span>
          </div>

          {/* Headline row */}
          <div style={{ display:"flex", alignItems:"flex-end", justifyContent:"space-between", flexWrap:"wrap", gap:"20px" }}>
            <div>
              {/* Live badge */}
              <div style={{ display:"inline-flex", alignItems:"center", gap:"7px", background:"rgba(245,166,35,.11)", border:"1px solid rgba(245,166,35,.25)", borderRadius:"100px", padding:"5px 16px", marginBottom:"18px" }}>
                <div style={{ width:"6px", height:"6px", borderRadius:"50%", background:"#F5A623", animation:"pulse 2s infinite" }}/>
                <span style={{ fontSize:"11px", fontWeight:700, color:"#F5A623", fontFamily:"Manrope,sans-serif", letterSpacing:"0.8px", textTransform:"uppercase" }}>Menu Live Now</span>
              </div>
              <h1 style={{ fontSize:"clamp(28px,4.5vw,48px)", fontWeight:900, color:"#fff", fontFamily:"Manrope,sans-serif", letterSpacing:"-1.2px", lineHeight:1.08, marginBottom:"12px" }}>
                Choose Your Canteen
              </h1>
              <p style={{ fontSize:"15px", color:"rgba(255,255,255,.55)", lineHeight:1.7, maxWidth:"440px" }}>
                Pre-order from your preferred canteen and skip the queue. Ready for pickup in minutes.
              </p>
            </div>

            {/* Date chip */}
            <div style={{ background:"rgba(245,166,35,.1)", border:"1px solid rgba(245,166,35,.22)", borderRadius:"14px", padding:"14px 20px", flexShrink:0, textAlign:"right" }}>
              <div style={{ fontSize:"10px", color:"#F5A623", fontWeight:800, fontFamily:"Manrope,sans-serif", letterSpacing:"1px", textTransform:"uppercase", marginBottom:"5px" }}>Today</div>
              <div style={{ fontSize:"13px", color:"rgba(255,255,255,.85)", fontWeight:700, fontFamily:"Manrope,sans-serif" }}>{today}</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Stats strip ── */}
      <div style={{ background:"rgba(255,255,255,.03)", borderBottom:"1px solid rgba(255,255,255,.07)" }}>
        <div style={{ maxWidth:"1100px", margin:"0 auto", padding:"0 clamp(20px,6vw,60px)", display:"flex", overflowX:"auto" }}>
          {[
            { icon:<Layers size={15} color="#F5A623"/>,          label:"7 Categories" },
            { icon:<UtensilsCrossed size={15} color="#F5A623"/>, label:"31 Items" },
            { icon:<Timer size={15} color="#F5A623"/>,           label:"5–15 min pickup" },
            { icon:<Package size={15} color="#F5A623"/>,         label:"2 Canteens Open" },
          ].map((s,i) => (
            <div key={i} style={{ display:"flex", alignItems:"center", gap:"8px", padding:"14px 24px", borderRight: i < 3 ? "1px solid rgba(255,255,255,.07)" : "none", flexShrink:0 }}>
              {s.icon}
              <span style={{ fontSize:"13px", color:"rgba(255,255,255,.65)", fontWeight:600, whiteSpace:"nowrap" }}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Canteen cards ── */}
      <div style={{ maxWidth:"1100px", margin:"0 auto", padding:"40px clamp(20px,6vw,60px) 80px", display:"flex", flexDirection:"column", gap:"20px" }}>
        {CANTEENS.map((c,i) => (
          <div key={c.id} className="canteen-row"
            style={{ opacity: c.status==="closed" ? .5 : 1, cursor: c.status==="closed" ? "not-allowed" : "pointer", animation:`fadeUp .55s cubic-bezier(.22,.68,0,1.2) ${i*.13}s both` }}
            onClick={() => c.status==="open" && onSelect(c)}
          >
            {/* Image */}
            <div style={{ width:"clamp(140px,26%,210px)", flexShrink:0, overflow:"hidden", position:"relative" }}>
              <img src={c.img} alt={c.name} style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }}/>
              {/* Tag */}
              <div style={{ position:"absolute", bottom:"12px", left:"12px", background:"#F5A623", color:"#07091a", borderRadius:"6px", padding:"3px 10px", fontSize:"11px", fontWeight:800, fontFamily:"Manrope,sans-serif" }}>
                {c.tags[0]}
              </div>
            </div>

            {/* Info */}
            <div style={{ flex:1, padding:"24px 26px", display:"flex", flexDirection:"column", justifyContent:"space-between" }}>
              <div>
                {/* Name + status */}
                <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:"8px", gap:"12px" }}>
                  <div>
                    <h3 style={{ fontSize:"20px", fontWeight:900, color:"#fff", fontFamily:"Manrope,sans-serif", letterSpacing:"-0.5px", marginBottom:"4px" }}>{c.name}</h3>
                    <p style={{ fontSize:"13px", color:"rgba(255,255,255,.45)" }}>{c.subtitle}</p>
                  </div>
                  {/* Status pill */}
                  <div style={{ display:"flex", alignItems:"center", gap:"5px", background: c.status==="open" ? "rgba(34,197,94,.12)" : "rgba(239,68,68,.12)", border:`1px solid ${c.status==="open" ? "rgba(34,197,94,.3)" : "rgba(239,68,68,.3)"}`, borderRadius:"100px", padding:"5px 12px", flexShrink:0 }}>
                    <span className={c.status==="open" ? "dot-open" : "dot-closed"}/>
                    <span style={{ fontSize:"12px", fontWeight:700, fontFamily:"Manrope,sans-serif", color: c.status==="open" ? "#22c55e" : "#f87171" }}>
                      {c.status==="open" ? "Open Now" : "Closed"}
                    </span>
                  </div>
                </div>

                <p style={{ fontSize:"13px", color:"rgba(255,255,255,.5)", lineHeight:1.7, marginBottom:"16px" }}>{c.desc}</p>

                {/* Stat chips */}
                <div style={{ display:"flex", flexWrap:"wrap", gap:"8px" }}>
                  {[
                    { icon:<Star size={12} fill="#F5A623" color="#F5A623"/>, text:`${c.rating} (${c.reviews} reviews)` },
                    { icon:<Timer size={12} color="#F5A623"/>,               text:c.waitTime },
                    { icon:<MapPin size={12} color="#F5A623"/>,              text:c.location },
                    { icon:<UtensilsCrossed size={12} color="#F5A623"/>,     text:c.priceRange },
                  ].map((s,j) => (
                    <div key={j} style={{ display:"flex", alignItems:"center", gap:"5px", background:"rgba(255,255,255,.06)", border:"1px solid rgba(255,255,255,.09)", borderRadius:"8px", padding:"5px 10px" }}>
                      {s.icon}
                      <span style={{ fontSize:"12px", color:"rgba(255,255,255,.7)", fontWeight:600 }}>{s.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div style={{ display:"flex", justifyContent:"flex-end", paddingTop:"18px", borderTop:"1px solid rgba(255,255,255,.07)", marginTop:"18px" }}>
                <button
                  disabled={c.status==="closed"}
                  className={c.status==="open" ? "btn-primary" : ""}
                  style={ c.status==="closed" ? { background:"rgba(255,255,255,.08)", color:"rgba(255,255,255,.3)", border:"none", borderRadius:"10px", padding:"11px 22px", fontSize:"13px", fontWeight:700, cursor:"not-allowed", fontFamily:"Manrope,sans-serif" } : { fontSize:"13px", padding:"11px 22px" }}
                  onClick={e => { e.stopPropagation(); c.status==="open" && onSelect(c); }}
                >
                  {c.status==="open" ? <><span>View Today's Menu</span> <ChevronRight size={14}/></> : "Currently Closed"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   MENU PAGE
───────────────────────────────────────────────────────────────────────────── */
function MenuPage({ canteen, cart, onAdd, onRemove, onBack, menuSections, menuLoading, menuError }) {
  const [activeCategory, setActiveCategory] = useState("");
  const [search, setSearch] = useState("");
  const sectionRefs = useRef({});

  const getQty = id => cart.find(c => c.id===id)?.qty || 0;
  const allItems = useMemo(
    () => menuSections.flatMap(cat => cat.items.map(i => ({ ...i, category: cat.category }))),
    [menuSections]
  );
  const searchResults = search
    ? allItems.filter(i =>
        i.name.toLowerCase().includes(search.toLowerCase()) ||
        i.desc.toLowerCase().includes(search.toLowerCase())
      )
    : null;

  const goToCategory = cat => {
    setActiveCategory(cat);
    const el = sectionRefs.current[cat];
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 150, behavior:"smooth" });
  };

  useEffect(() => {
    const fn = () => {
      for (const cat of menuSections.map(c => c.category)) {
        const el = sectionRefs.current[cat];
        if (!el) continue;
        const r = el.getBoundingClientRect();
        if (r.top <= 170 && r.bottom > 170) { setActiveCategory(cat); break; }
      }
    };
    window.addEventListener("scroll", fn, { passive:true });
    return () => window.removeEventListener("scroll", fn);
  }, [menuSections]);

  useEffect(() => {
    if (menuSections.length > 0 && !menuSections.some(section => section.category === activeCategory)) {
      setActiveCategory(menuSections[0].category);
    }
  }, [menuSections, activeCategory]);

  return (
    <div style={{ width:"100%", background:"#07091a", minHeight:"calc(100vh - 66px)" }}>

      {/* Canteen cover */}
      <div style={{ position:"relative", height:"clamp(160px,25vw,260px)", overflow:"hidden" }}>
        <img src={canteen.img} alt={canteen.name} style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }}/>
        <div style={{ position:"absolute", inset:0, background:"linear-gradient(to bottom,rgba(7,9,26,.3) 0%,rgba(7,9,26,.88) 100%)" }}/>
        <div style={{ position:"absolute", bottom:"24px", left:"clamp(20px,6vw,60px)", right:"clamp(20px,6vw,60px)" }}>
          <button className="btn-back" onClick={onBack} style={{ marginBottom:"14px" }}>
            <ArrowLeft size={13}/> All Canteens
          </button>
          <div style={{ display:"flex", alignItems:"flex-end", justifyContent:"space-between", flexWrap:"wrap", gap:"12px" }}>
            <div>
              <h2 style={{ fontSize:"clamp(20px,3.5vw,32px)", fontWeight:900, color:"#fff", fontFamily:"Manrope,sans-serif", letterSpacing:"-0.7px", marginBottom:"6px" }}>{canteen.name}</h2>
              <div style={{ display:"flex", alignItems:"center", gap:"16px", flexWrap:"wrap" }}>
                {[
                  <><span className="dot-open"/> <span style={{ color:"#22c55e", fontWeight:600, fontSize:"13px" }}>Open Now</span></>,
                  <><Star size={12} fill="#F5A623" color="#F5A623"/> <span style={{ color:"rgba(255,255,255,.7)", fontSize:"13px" }}>{canteen.rating} · {canteen.reviews} reviews</span></>,
                  <><Timer size={12} color="#F5A623"/> <span style={{ color:"rgba(255,255,255,.7)", fontSize:"13px" }}>{canteen.waitTime}</span></>,
                  <><MapPin size={12} color="#F5A623"/> <span style={{ color:"rgba(255,255,255,.7)", fontSize:"13px" }}>{canteen.location}</span></>,
                ].map((item,i) => (
                  <div key={i} style={{ display:"flex", alignItems:"center", gap:"5px" }}>{item}</div>
                ))}
              </div>
            </div>
            <div style={{ background:"rgba(245,166,35,.15)", border:"1px solid rgba(245,166,35,.3)", borderRadius:"10px", padding:"8px 16px", textAlign:"center" }}>
              <div style={{ fontSize:"10px", color:"#F5A623", fontWeight:800, fontFamily:"Manrope,sans-serif", letterSpacing:"1px", marginBottom:"2px" }}>PICKUP</div>
              <div style={{ fontSize:"14px", fontWeight:800, color:"#fff", fontFamily:"Manrope,sans-serif" }}>{canteen.waitTime}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky search + category bar */}
      <div style={{
        position:"sticky", top:"66px", zIndex:100,
        background:"rgba(7,9,26,.97)", backdropFilter:"blur(16px)",
        borderBottom:"1px solid rgba(255,255,255,.07)",
        padding:"12px clamp(20px,6vw,60px) 10px"
      }}>
        <div className="search-wrap" style={{ marginBottom:"10px", maxWidth:"400px" }}>
          <Search size={15} color="rgba(255,255,255,.35)"/>
          <input placeholder={`Search ${canteen.name} menu...`} value={search} onChange={e => setSearch(e.target.value)}/>
          {search && <X size={15} color="rgba(255,255,255,.4)" style={{ cursor:"pointer", flexShrink:0 }} onClick={() => setSearch("")}/>}
        </div>
        {!search && (
          <div className="cat-scroll">
            {menuSections.map((cat,i) => (
              <button key={i} className={`cat-pill${activeCategory===cat.category?" active":""}`}
                onClick={() => goToCategory(cat.category)}>
                <span style={{ display:"flex", alignItems:"center" }}>{cat.icon}</span>
                {cat.category}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Menu content */}
      <div style={{ maxWidth:"1100px", margin:"0 auto", padding:"32px clamp(20px,6vw,60px) 120px" }}>

        {menuLoading && (
          <div style={{ marginBottom:"16px", padding:"14px 16px", borderRadius:"12px", background:"rgba(255,255,255,.04)", border:"1px solid rgba(255,255,255,.08)", color:"rgba(255,255,255,.65)", fontSize:"13px" }}>
            Loading main canteen menu...
          </div>
        )}

        {menuError && (
          <div style={{ marginBottom:"16px", padding:"14px 16px", borderRadius:"12px", background:"rgba(239,68,68,.08)", border:"1px solid rgba(239,68,68,.2)", color:"#f87171", fontSize:"13px" }}>
            {menuError}
          </div>
        )}

        {/* Search results */}
        {search && (
          <div>
            <p style={{ fontSize:"13px", color:"rgba(255,255,255,.45)", marginBottom:"16px" }}>
              {searchResults.length} result{searchResults.length!==1?"s":""} for{" "}
              <strong style={{ color:"#F5A623" }}>"{search}"</strong>
            </p>
            {searchResults.length === 0 ? (
              <div style={{ textAlign:"center", padding:"80px 0" }}>
                <Search size={40} style={{ display:"block", margin:"0 auto 14px", color:"rgba(255,255,255,.2)" }}/>
                <p style={{ fontSize:"16px", fontWeight:600, color:"rgba(255,255,255,.6)" }}>No items found</p>
                <p style={{ fontSize:"13px", color:"rgba(255,255,255,.35)", marginTop:"6px" }}>Try a different keyword</p>
              </div>
            ) : (
              <div style={{ background:"rgba(255,255,255,.04)", border:"1px solid rgba(255,255,255,.08)", borderRadius:"18px", overflow:"hidden" }}>
                {searchResults.map(item => <MenuItem key={item.id} item={item} qty={getQty(item.id)} onAdd={onAdd} onRemove={onRemove}/>)}
              </div>
            )}
          </div>
        )}

        {/* Category sections */}
        {!search && menuSections.map((cat,ci) => (
          <div key={ci} ref={el => sectionRefs.current[cat.category]=el} style={{ marginBottom:"40px" }}>
            {/* Section header */}
            <div className="sec-head">
              <span style={{ display:"flex", alignItems:"center", gap:"7px", fontSize:"15px", fontWeight:900, color:"#fff", fontFamily:"Manrope,sans-serif", whiteSpace:"nowrap" }}>
                <span style={{ color:"#F5A623", display:"flex" }}>{cat.icon}</span>
                {cat.category}
              </span>
              <div className="sec-line"/>
              <span style={{ fontSize:"12px", color:"rgba(255,255,255,.35)", whiteSpace:"nowrap" }}>{cat.items.length} items</span>
            </div>

            {/* Items card */}
            <div style={{ background:"rgba(255,255,255,.04)", border:"1px solid rgba(255,255,255,.08)", borderRadius:"18px", overflow:"hidden" }}>
              {cat.items.map(item => <MenuItem key={item.id} item={item} qty={getQty(item.id)} onAdd={onAdd} onRemove={onRemove}/>)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Single menu item ─────────────────────────────────────────────────────── */
function MenuItem({ item, qty, onAdd, onRemove }) {
  return (
    <div
      className="menu-item"
      style={{
        opacity: item.isAvailable === false ? 0.45 : 1,
      }}
    >
      {/* Text */}
      <div style={{ flex:1, minWidth:0 }}>
        {(item.tags.length > 0 || item.isAvailable === false) && (
          <div style={{ display:"flex", gap:"5px", flexWrap:"wrap", marginBottom:"6px" }}>
            {item.tags.map(t => (
              <span key={t} className={`tag ${TAGS[t]?.cls}`}>
                {TAGS[t]?.label}
              </span>
            ))}
            {item.isAvailable === false && (
              <span
                className="tag"
                style={{ background:"rgba(255,255,255,.10)", color:"rgba(255,255,255,.72)" }}
              >
                Unavailable
              </span>
            )}
          </div>
        )}
        <h4 style={{ fontSize:"15px", fontWeight:800, color:"#fff", fontFamily:"Manrope,sans-serif", marginBottom:"5px", lineHeight:1.3 }}>{item.name}</h4>
        <p style={{ fontSize:"13px", color:"rgba(255,255,255,.45)", lineHeight:1.6, marginBottom:"10px" }}>{item.desc}</p>
        <div style={{ display:"flex", alignItems:"center", gap:"12px", flexWrap:"wrap" }}>
          <span style={{ fontSize:"17px", fontWeight:900, color:"#F5A623", fontFamily:"Manrope,sans-serif" }}>Rs. {item.price}</span>
          <span style={{ fontSize:"12px", color:"rgba(255,255,255,.3)", display:"flex", alignItems:"center", gap:"3px" }}>
            <Star size={10} fill="#F5A623" color="#F5A623"/> {item.rating}
          </span>
          {item.cal && <span style={{ fontSize:"12px", color:"rgba(255,255,255,.25)" }}>{item.cal} cal</span>}
          {item.time && item.time!=="–" && (
            <span style={{ fontSize:"12px", color:"rgba(255,255,255,.25)", display:"flex", alignItems:"center", gap:"3px" }}>
              <Timer size={10}/> {item.time}
            </span>
          )}
        </div>
      </div>

      {/* Image + controls */}
      <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:"10px", flexShrink:0 }}>
        <img className="menu-item-img" src={item.img} alt={item.name}
          onError={e => { e.target.src="https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&q=80"; }}
        />
        {item.isAvailable === false ? (
          <button
            type="button"
            disabled
            style={{
              minWidth:"96px",
              height:"34px",
              borderRadius:"999px",
              background:"rgba(255,255,255,.08)",
              color:"rgba(255,255,255,.55)",
              fontSize:"12px",
              fontWeight:800,
              fontFamily:"Manrope,sans-serif",
              cursor:"not-allowed",
            }}
          >
            Unavailable
          </button>
        ) : qty === 0 ? (
          <button className="add-btn" onClick={() => onAdd(item)}>
            <Plus size={16}/>
          </button>
        ) : (
          <div className="qty-row">
            <button className="qty-btn qty-minus" onClick={() => onRemove(item.id)}>
              <Minus size={12}/>
            </button>
            <span style={{ fontSize:"15px", fontWeight:900, color:"#fff", fontFamily:"Manrope,sans-serif", minWidth:"18px", textAlign:"center" }}>
              {qty}
            </span>
            <button className="qty-btn qty-plus" onClick={() => onAdd(item)}>
              <Plus size={12}/>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   CART PANEL
───────────────────────────────────────────────────────────────────────────── */
function CartPanel({ cart, canteen, onAdd, onRemove, onClose, onCheckout }) {
  const subtotal = cart.reduce((s,i) => s + i.price*i.qty, 0);
  const fee = 10;
  const total = subtotal + fee;
  const totalItems = cart.reduce((s,i) => s+i.qty, 0);

  return (
    <>
      <div className="cart-overlay" onClick={onClose}/>
      <div className="cart-panel">
        {/* Header */}
        <div style={{ padding:"22px 24px 16px", borderBottom:"1px solid rgba(255,255,255,.07)" }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"4px" }}>
            <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
              <h2 style={{ fontSize:"19px", fontWeight:900, color:"#fff", fontFamily:"Manrope,sans-serif" }}>Your Order</h2>
              {totalItems > 0 && (
                <span style={{ background:"#F5A623", color:"#07091a", borderRadius:"100px", padding:"2px 10px", fontSize:"12px", fontWeight:800, fontFamily:"Manrope,sans-serif" }}>{totalItems}</span>
              )}
            </div>
            <button className="icon-btn" onClick={onClose}><X size={18}/></button>
          </div>
          {canteen && (
            <p style={{ fontSize:"12px", color:"rgba(255,255,255,.38)", display:"flex", alignItems:"center", gap:"4px" }}>
              <UtensilsCrossed size={11}/> {canteen.name} &nbsp;·&nbsp; {canteen.waitTime}
            </p>
          )}
        </div>

        {/* Items */}
        <div style={{ flex:1, overflowY:"auto", padding:"6px 24px" }}>
          {cart.length === 0 ? (
            <div style={{ textAlign:"center", padding:"60px 0" }}>
              <ShoppingCart size={44} style={{ display:"block", margin:"0 auto 14px", color:"rgba(255,255,255,.18)" }}/>
              <p style={{ fontSize:"15px", fontWeight:600, color:"rgba(255,255,255,.5)" }}>Your cart is empty</p>
              <p style={{ fontSize:"13px", color:"rgba(255,255,255,.3)", marginTop:"6px" }}>Add items from the menu</p>
            </div>
          ) : cart.map((item,i) => (
            <div key={item.id} className="cart-item" style={{ animationDelay:`${i*.04}s` }}>
              <img src={item.img} alt={item.name}
                style={{ width:"52px", height:"52px", borderRadius:"10px", objectFit:"cover", flexShrink:0, border:"1px solid rgba(255,255,255,.08)" }}/>
              <div style={{ flex:1, minWidth:0 }}>
                <p style={{ fontSize:"13px", fontWeight:700, color:"#fff", fontFamily:"Manrope,sans-serif", marginBottom:"3px", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{item.name}</p>
                <p style={{ fontSize:"13px", fontWeight:800, color:"#F5A623", fontFamily:"Manrope,sans-serif" }}>Rs. {item.price*item.qty}</p>
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:"8px", flexShrink:0 }}>
                <button className="qty-btn qty-minus" style={{ width:"26px", height:"26px" }} onClick={() => onRemove(item.id)}><Minus size={11}/></button>
                <span style={{ fontSize:"14px", fontWeight:900, color:"#fff", fontFamily:"Manrope,sans-serif", minWidth:"16px", textAlign:"center" }}>{item.qty}</span>
                <button className="qty-btn qty-plus"  style={{ width:"26px", height:"26px" }} onClick={() => onAdd(item)}><Plus size={11}/></button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div style={{ padding:"16px 24px 24px", borderTop:"1px solid rgba(255,255,255,.07)" }}>
            <div style={{ background:"rgba(255,255,255,.04)", borderRadius:"14px", padding:"16px", marginBottom:"14px" }}>
              {[
                ["Subtotal",     `Rs. ${subtotal}`,              false],
                ["Platform fee", `Rs. ${fee}`,                   false],
                ["Pickup in",    canteen?.waitTime||"10–15 min",  true ],
              ].map(([l,v,accent],i) => (
                <div key={i} style={{ display:"flex", justifyContent:"space-between", marginBottom: i<2 ? "9px" : "0" }}>
                  <span style={{ fontSize:"13px", color:"rgba(255,255,255,.45)" }}>{l}</span>
                  <span style={{ fontSize:"13px", color: accent ? "#F5A623" : "rgba(255,255,255,.75)", fontWeight: i===1 ? 700 : 400 }}>{v}</span>
                </div>
              ))}
              <div style={{ height:"1px", background:"rgba(255,255,255,.07)", margin:"12px 0" }}/>
              <div style={{ display:"flex", justifyContent:"space-between" }}>
                <span style={{ fontSize:"15px", fontWeight:800, color:"#fff", fontFamily:"Manrope,sans-serif" }}>Total</span>
                <span style={{ fontSize:"16px", fontWeight:900, color:"#F5A623", fontFamily:"Manrope,sans-serif" }}>Rs. {total}</span>
              </div>
            </div>
            <button className="btn-primary" style={{ width:"100%", justifyContent:"center", padding:"15px", fontSize:"15px" }} onClick={onCheckout}>
              Choose Payment <ChevronRight size={15}/>
            </button>
          </div>
        )}
      </div>
    </>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   PAYMENT MODAL
───────────────────────────────────────────────────────────────────────────── */
const BANK = {
  bank: "Bank of Ceylon",
  branch: "Maradana Branch",
  account: "8001234567",
  name: "SLIT Canteen Services",
};

function PaymentModal({ order, canteen, onConfirm, onClose, placingOrder, orderError }) {
  const [method, setMethod] = useState(null);
  const [copied, setCopied] = useState(false);
  const [receipt, setReceipt] = useState(null);
  const [paymentReference, setPaymentReference] = useState("");
  const [loadingReference, setLoadingReference] = useState(false);
  useEffect(() => {
    const fetchPaymentReference = async () => {
      try {
        setLoadingReference(true);
        const res = await api.get("/orders/payment-reference");
        setPaymentReference(res.data?.data?.paymentReference || "");
      } catch (error) {
        setPaymentReference("");
      } finally {
        setLoadingReference(false);
      }
    };

    if (method === "bank_transfer" && !paymentReference) {
      fetchPaymentReference();
    }

    if (method !== "bank_transfer") {
      setReceipt(null);
      setPaymentReference("");
    }
  }, [method]);
  const total = order.reduce((s,i) => s+i.price*i.qty, 0) + 10;

  const copyAccount = () => {
    navigator.clipboard.writeText(BANK.account).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const canConfirm =
    method === "cash" ||
    (method === "bank_transfer" && receipt && paymentReference && !loadingReference);

  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()} style={{ maxHeight:"90vh", overflowY:"auto" }}>

        {/* Header */}
        <div style={{ padding:"24px 26px 0" }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"6px" }}>
            <h2 style={{ fontSize:"19px", fontWeight:900, color:"#fff", fontFamily:"Manrope,sans-serif" }}>Choose Payment</h2>
            <button className="icon-btn" onClick={onClose} style={{ flexShrink:0 }}><X size={18}/></button>
          </div>
          <p style={{ fontSize:"13px", color:"rgba(255,255,255,.45)", marginBottom:"20px" }}>
            Select how you'd like to pay for your order
          </p>

          {/* Order summary line */}
          <div style={{ background:"rgba(245,166,35,.08)", border:"1px solid rgba(245,166,35,.18)", borderRadius:"10px", padding:"10px 14px", display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"20px" }}>
            <span style={{ fontSize:"13px", color:"rgba(255,255,255,.55)" }}>{order.reduce((s,i)=>s+i.qty,0)} items · {canteen?.name}</span>
            <span style={{ fontSize:"15px", fontWeight:900, color:"#F5A623", fontFamily:"Manrope,sans-serif" }}>Rs. {total}</span>
          </div>
        </div>

        <div style={{ padding:"0 26px 24px" }}>
          {/* Pay when collect */}
          <div className={`pay-opt${method==="cash"?" selected":""}`} onClick={() => setMethod("cash")}>
            <div className="pay-opt-icon">
              <HandCoins size={20} color="#F5A623"/>
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:"14px", fontWeight:800, color:"#fff", fontFamily:"Manrope,sans-serif", marginBottom:"2px" }}>Pay When Collect</div>
              <div style={{ fontSize:"12px", color:"rgba(255,255,255,.45)" }}>Pay cash at the canteen when you pick up your order</div>
            </div>
            <div style={{
              width:"18px", height:"18px", borderRadius:"50%", flexShrink:0,
              border: method==="cash" ? "5px solid #F5A623" : "2px solid rgba(255,255,255,.2)",
              background: method==="cash" ? "#F5A623" : "transparent",
              transition:"all .2s"
            }}/>
          </div>

          {/* Bank transfer */}
          <div className={`pay-opt${method==="bank_transfer"?" selected":""}`} onClick={() => setMethod("bank_transfer")}>
            <div className="pay-opt-icon">
              <Banknote size={20} color="#F5A623"/>
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:"14px", fontWeight:800, color:"#fff", fontFamily:"Manrope,sans-serif", marginBottom:"2px" }}>Bank Transfer</div>
              <div style={{ fontSize:"12px", color:"rgba(255,255,255,.45)" }}>Transfer to our bank account before pickup</div>
            </div>
            <div style={{
              width:"18px", height:"18px", borderRadius:"50%", flexShrink:0,
              border: method==="bank_transfer" ? "5px solid #F5A623" : "2px solid rgba(255,255,255,.2)",
              background: method==="bank_transfer" ? "#F5A623" : "transparent",
              transition:"all .2s"
            }}/>
          </div>

          {/* Bank details — shown when bank selected */}
          {method === "bank_transfer" && (
            <div style={{ background:"rgba(255,255,255,.04)", border:"1px solid rgba(255,255,255,.09)", borderRadius:"14px", padding:"16px", marginBottom:"16px", animation:"trackReveal .3s ease both" }}>
              <p style={{ fontSize:"11px", fontWeight:800, color:"#F5A623", fontFamily:"Manrope,sans-serif", letterSpacing:"1px", textTransform:"uppercase", marginBottom:"14px" }}>Bank Details</p>
              {[
                ["Bank",        BANK.bank],
                ["Branch",      BANK.branch],
                ["Account No.", BANK.account],
                ["Account Name",BANK.name],
                ["Reference",   loadingReference ? "Generating..." : paymentReference || "Not available"],
              ].map(([l,v],i) => (
                <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom: i<4 ? "10px":"0" }}>
                  <span style={{ fontSize:"12px", color:"rgba(255,255,255,.4)" }}>{l}</span>
                  <div style={{ display:"flex", alignItems:"center", gap:"6px" }}>
                    <span style={{ fontSize:"13px", fontWeight:700, color: i===2||i===4 ? "#F5A623":"rgba(255,255,255,.8)", fontFamily:"Manrope,sans-serif" }}>{v}</span>
                    {i === 2 && (
                      <button onClick={copyAccount} style={{ background:"rgba(245,166,35,.15)", border:"1px solid rgba(245,166,35,.25)", borderRadius:"6px", padding:"2px 8px", cursor:"pointer", display:"flex", alignItems:"center", gap:"3px", transition:"all .2s" }}
                        onMouseOver={e=>e.currentTarget.style.background="rgba(245,166,35,.25)"}
                        onMouseOut={e=>e.currentTarget.style.background="rgba(245,166,35,.15)"}
                      >
                        <Copy size={10} color="#F5A623"/>
                        <span style={{ fontSize:"10px", color:"#F5A623", fontWeight:700, fontFamily:"Manrope,sans-serif" }}>{copied?"Copied!":"Copy"}</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
              <div style={{ marginTop:"12px", paddingTop:"12px", borderTop:"1px solid rgba(255,255,255,.07)", display:"flex", alignItems:"flex-start", gap:"6px" }}>
              <span style={{ fontSize:"11px", color:"#F5A623", lineHeight:1.7 }}>
                ⚠ Transfer Rs. {total} and use reference <strong>{loadingReference ? "Generating..." : paymentReference || "Not available"}</strong> in your bank transfer. Your order will be prepared once payment is confirmed.
              </span>
              </div>
            </div>
          )}

          {/* Receipt upload — only for bank transfer */}
          {method === "bank_transfer" && (
            <div style={{ marginBottom:"14px", animation:"trackReveal .3s ease both" }}>
              <p style={{ fontSize:"11px", fontWeight:800, color:"rgba(255,255,255,.5)", fontFamily:"Manrope,sans-serif", letterSpacing:"1px", textTransform:"uppercase", marginBottom:"8px" }}>
                Upload Payment Receipt
              </p>
              <label style={{
                display:"flex", alignItems:"center", gap:"12px",
                padding:"14px 16px", borderRadius:"14px", cursor:"pointer",
                border: receipt ? "1.5px solid rgba(245,166,35,.5)" : "1.5px dashed rgba(255,255,255,.2)",
                background: receipt ? "rgba(245,166,35,.07)" : "rgba(255,255,255,.03)",
                transition:"all .22s"
              }}
                onMouseOver={e=>{ if(!receipt){ e.currentTarget.style.borderColor="rgba(245,166,35,.35)"; e.currentTarget.style.background="rgba(245,166,35,.05)"; }}}
                onMouseOut={e=>{ if(!receipt){ e.currentTarget.style.borderColor="rgba(255,255,255,.2)"; e.currentTarget.style.background="rgba(255,255,255,.03)"; }}}
              >
                <input type="file" accept="image/*,application/pdf" style={{ display:"none" }}
                  onChange={e => {
                    const f = e.target.files?.[0];
                    if(f) setReceipt(f);
                  }}
                />
                <div style={{
                  width:"40px", height:"40px", borderRadius:"10px", flexShrink:0,
                  background: receipt ? "rgba(245,166,35,.2)" : "rgba(255,255,255,.07)",
                  display:"flex", alignItems:"center", justifyContent:"center"
                }}>
                  {receipt
                    ? <CheckCircle size={20} color="#F5A623"/>
                    : <Banknote size={20} color="rgba(255,255,255,.4)"/>
                  }
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  {receipt ? (
                    <>
                      <p style={{ fontSize:"13px", fontWeight:700, color:"#F5A623", fontFamily:"Manrope,sans-serif", marginBottom:"2px", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{receipt.name}</p>
                      <p style={{ fontSize:"11px", color:"rgba(255,255,255,.4)" }}>{(receipt.size/1024).toFixed(1)} KB · Tap to change</p>
                    </>
                  ) : (
                    <>
                      <p style={{ fontSize:"13px", fontWeight:600, color:"rgba(255,255,255,.7)", marginBottom:"2px" }}>Tap to upload receipt</p>
                      <p style={{ fontSize:"11px", color:"rgba(255,255,255,.35)" }}>JPG, PNG or PDF · Max 5MB</p>
                    </>
                  )}
                </div>
              </label>
            </div>
          )}

          {orderError && (
            <div
              style={{
                marginTop: "12px",
                marginBottom: "12px",
                padding: "10px 12px",
                borderRadius: "10px",
                background: "rgba(239,68,68,.10)",
                border: "1px solid rgba(239,68,68,.22)",
                color: "#f87171",
                fontSize: "12px",
                lineHeight: 1.6,
              }}
            >
              {orderError}
            </div>
          )}

          {/* Confirm button */}
          <button
            className="btn-primary"
            style={{
              width: "100%",
              justifyContent: "center",
              padding: "15px",
              fontSize: "15px",
              opacity: canConfirm && !placingOrder ? 1 : 0.45,
              cursor: canConfirm && !placingOrder ? "pointer" : "not-allowed",
            }}
            onClick={() => canConfirm && !placingOrder && onConfirm(method, receipt, paymentReference)}
          >
            {placingOrder
              ? "Placing Order..."
              : method === null
              ? "Select a payment method"
              : method === "cash"
              ? "Confirm — Pay on Collect"
              : "Confirm — Bank Transfer"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   ORDER CONFIRMED MODAL
───────────────────────────────────────────────────────────────────────────── */
function OrderConfirmedModal({ order, canteen, payMethod, orderId, onTrack, onClose, onCancel }) {
  const total = order.reduce((s,i) => s+i.price*i.qty, 0) + 10;
  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        {/* Amber strip */}
        <div style={{ background:"linear-gradient(135deg,#F5A623,#f9ba3c)", padding:"14px 18px", textAlign:"center" }}>
          <div style={{ width:"36px", height:"36px", borderRadius:"50%", background:"rgba(255,255,255,.25)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 8px", animation:"popIn .4s cubic-bezier(.22,.68,0,1.2)" }}>
            <CheckCircle size={20} color="#fff"/>
          </div>
          <h2 style={{ fontSize:"15px", fontWeight:900, color:"#07091a", fontFamily:"Manrope,sans-serif", marginBottom:"2px" }}>Order Confirmed! 🎉</h2>
          <p style={{ fontSize:"11px", color:"rgba(7,9,26,.65)" }}>Your order is being prepared</p>
        </div>

        {/* Details */}
        <div style={{ padding:"16px 20px" }}>
          <div style={{ background:"rgba(255,255,255,.04)", borderRadius:"14px", padding:"14px 16px", marginBottom:"16px" }}>
            {[
              ["Order ID",  orderId,                                   "#F5A623"],
              ["Canteen",   canteen?.name||"–",                        "rgba(255,255,255,.8)"],
              ["Payment",   payMethod==="cash"?"Pay on Collect":"Bank Transfer", payMethod==="bank_transfer"?"#60a5fa":"#22c55e"],
              ["Total",     `Rs. ${total}`,                            "#F5A623"],
              ["Ready in",  canteen?.waitTime||"10–15 min",            "#22c55e"],
            ].map(([l,v,c],i) => (
              <div key={i} style={{ display:"flex", justifyContent:"space-between", marginBottom: i<4?"5px":"0" }}>
                <span style={{ fontSize:"13px", color:"rgba(255,255,255,.45)" }}>{l}</span>
                <span style={{ fontSize:"13px", fontWeight:700, color:c, fontFamily:"Manrope,sans-serif" }}>{v}</span>
              </div>
            ))}
          </div>

          {payMethod === "bank_transfer" && (
            <div
              style={{
                background:"rgba(96,165,250,.08)",
                border:"1px solid rgba(96,165,250,.2)",
                borderRadius:"8px",
                padding:"8px 12px",
                marginBottom:"10px",
                fontSize:"11px",
                color:"rgba(255,255,255,.6)",
                lineHeight:1.65
              }}
            >
              💳 Your payment slip has been submitted successfully. We’ll verify the payment and start preparing your order once it is confirmed.
            </div>
          )}

          <button className="btn-primary" style={{ width:"100%", justifyContent:"center", padding:"9px", fontSize:"13px", marginBottom:"6px" }} onClick={onTrack}>
            Track My Order <ChevronRight size={15}/>
          </button>
          <button style={{ width:"100%", padding:"6px", background:"none", border:"none", color:"rgba(255,255,255,.38)", fontSize:"12px", cursor:"pointer", transition:"color .2s", fontFamily:"DM Sans,sans-serif" }}
            onMouseOver={e=>e.currentTarget.style.color="rgba(255,255,255,.75)"}
            onMouseOut={e=>e.currentTarget.style.color="rgba(255,255,255,.38)"}
            onClick={onClose}>
            Continue Ordering
          </button>
          <button className="btn-cancel" onClick={onCancel}>
            <Trash2 size={14}/> Cancel Order
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   ORDER TRACKING MODAL
───────────────────────────────────────────────────────────────────────────── */
function TrackingModal({ orderId, canteen, payMethod, trackedOrder, trackingLoading, trackingError, onClose }) {

  const getTrackingStepFromStatus = (status) => {
    switch (status) {
      case "pending":
        return 1;
      case "confirmed":
        return 2;
      case "preparing":
        return 3;
      case "ready":
        return 4;
      case "completed":
        return 5;
      case "cancelled":
        return 0;
      default:
        return 1;
    }
  };

  const activeStep = getTrackingStepFromStatus(trackedOrder?.orderStatus);

  const steps = [
    {
      icon: <CheckCircle size={15} />,
      label: "Order Confirmed",
      sub: "Your order has been received",
      time: activeStep >= 1 ? "Done" : "Pending",
      done: activeStep >= 1,
      active: activeStep === 1,
    },
    {
      icon: payMethod === "bank_transfer" ? <Banknote size={15} /> : <HandCoins size={15} />,
      label: payMethod === "bank_transfer" ? "Payment Verification" : "Payment on Collect",
      sub: payMethod === "bank_transfer" ? "Waiting for payment verification" : "Pay cash when you collect",
      time: activeStep >= 2 ? "In progress" : "Pending",
      done: activeStep >= 2,
      active: activeStep === 2,
    },
    {
      icon: <ChefHat size={15} />,
      label: "Preparing Your Order",
      sub: "The canteen is preparing your food",
      time: activeStep >= 3 ? "In progress" : "Pending",
      done: activeStep >= 3,
      active: activeStep === 3,
    },
    {
      icon: <PackageCheck size={15} />,
      label: "Ready for Pickup",
      sub: `Collect from ${canteen?.name || "canteen"}`,
      time: activeStep >= 4 ? "Ready" : "Pending",
      done: activeStep >= 4,
      active: activeStep === 4,
    },
    {
      icon: <CheckCircle size={15} />,
      label: "Completed",
      sub: "Order picked up successfully",
      time: activeStep >= 5 ? "Done" : "Pending",
      done: activeStep >= 5,
      active: activeStep === 5,
    },
  ];

  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div style={{ padding:"16px 22px 0" }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"3px" }}>
            <h2 style={{ fontSize:"17px", fontWeight:900, color:"#fff", fontFamily:"Manrope,sans-serif" }}>Track Order</h2>
            <button className="icon-btn" onClick={onClose}><X size={18}/></button>
          </div>
          {/* Order ID + canteen */}
          <div style={{ display:"flex", alignItems:"center", gap:"10px", marginBottom:"14px" }}>
            <span style={{ fontSize:"13px", color:"#F5A623", fontWeight:700, fontFamily:"Manrope,sans-serif" }}>{orderId}</span>
            <span style={{ width:"4px", height:"4px", borderRadius:"50%", background:"rgba(255,255,255,.3)" }}/>
            <span style={{ fontSize:"13px", color:"rgba(255,255,255,.45)" }}>{canteen?.name}</span>
          </div>
        </div>

        {trackingLoading && (
          <div
            style={{
              marginTop: "12px",
              padding: "10px 12px",
              borderRadius: "10px",
              background: "rgba(255,255,255,.05)",
              border: "1px solid rgba(255,255,255,.08)",
              color: "rgba(255,255,255,.65)",
              fontSize: "12px",
            }}
          >
            Loading tracking details...
          </div>
        )}

        {trackingError && (
          <div
            style={{
              marginTop: "12px",
              padding: "10px 12px",
              borderRadius: "10px",
              background: "rgba(239,68,68,.10)",
              border: "1px solid rgba(239,68,68,.22)",
              color: "#f87171",
              fontSize: "12px",
              lineHeight: 1.6,
            }}
          >
            {trackingError}
          </div>
        )}

        {trackedOrder?.orderStatus === "cancelled" && (
          <div
            style={{
              marginTop: "12px",
              padding: "10px 12px",
              borderRadius: "10px",
              background: "rgba(239,68,68,.10)",
              border: "1px solid rgba(239,68,68,.22)",
              color: "#f87171",
              fontSize: "12px",
              lineHeight: 1.6,
            }}
          >
            This order has been cancelled.
          </div>
        )}

        {/* Timeline */}
        <div style={{ padding:"0 22px 16px", display:"flex", flexDirection:"column", gap:"0" }}>
          {steps.map((step, i) => (
            <div key={i} className={`track-step${step.done?" done":""}`}
              style={{ marginBottom: i < steps.length-1 ? "4px" : "0", animation:`trackReveal .4s ease ${i*.1}s both` }}>

              {/* Dot + line */}
              <div style={{ display:"flex", flexDirection:"column", alignItems:"center" }}>
                <div className={`track-dot${step.done?" done":step.active?" active":""}`}>
                  {step.icon}
                </div>
                {i < steps.length-1 && (
                  <div style={{ width:"2px", flex:1, minHeight:"14px", background: step.done ? "rgba(245,166,35,.4)" : "rgba(255,255,255,.08)", margin:"3px 0", transition:"background .6s" }}/>
                )}
              </div>

              {/* Content */}
              <div style={{ paddingBottom: i < steps.length-1 ? "10px" : "0", paddingTop:"4px" }}>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:"12px" }}>
                  <span style={{ fontSize:"13px", fontWeight:800, color: step.done ? "#fff" : step.active ? "#fff" : "rgba(255,255,255,.35)", fontFamily:"Manrope,sans-serif", transition:"color .4s" }}>
                    {step.label}
                  </span>
                  <span style={{ fontSize:"11px", color: step.done ? "#F5A623" : step.active ? "#F5A623" : "rgba(255,255,255,.25)", fontWeight:600, fontFamily:"Manrope,sans-serif", whiteSpace:"nowrap", flexShrink:0 }}>
                    {step.time}
                  </span>
                </div>
                <p style={{ fontSize:"11px", color: step.done ? "rgba(255,255,255,.5)" : step.active ? "rgba(255,255,255,.5)" : "rgba(255,255,255,.2)", marginTop:"1px", transition:"color .4s" }}>
                  {step.sub}
                </p>
              </div>
            </div>
          ))}

          {/* Estimated time bar */}
          <div style={{ marginTop:"12px", padding:"10px 14px", background:"rgba(245,166,35,.08)", border:"1px solid rgba(245,166,35,.18)", borderRadius:"12px", display:"flex", alignItems:"center", gap:"10px" }}>
            <Clock3 size={16} color="#F5A623" style={{ flexShrink:0 }}/>
            <div>
              <div style={{ fontSize:"11px", fontWeight:800, color:"#F5A623", fontFamily:"Manrope,sans-serif", marginBottom:"1px" }}>Estimated Pickup Time</div>
              <div style={{ fontSize:"12px", color:"rgba(255,255,255,.6)" }}>{canteen?.waitTime||"10–15 min"} from order placement</div>
            </div>
          </div>

          <button className="btn-primary" style={{ width:"100%", justifyContent:"center", padding:"11px", fontSize:"13px", marginTop:"12px" }} onClick={onClose}>
            Done <CheckCircle size={14}/>
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   CANCEL CONFIRM MODAL
───────────────────────────────────────────────────────────────────────────── */
function CancelConfirmModal({ orderId, onConfirmCancel, onDismiss }) {
  return (
    <div className="modal-bg" onClick={onDismiss}>
      <div className="cancel-dialog" onClick={e => e.stopPropagation()}>

        {/* Red top strip */}
        <div style={{ background:"linear-gradient(135deg,rgba(239,68,68,.18),rgba(239,68,68,.08))", borderBottom:"1px solid rgba(239,68,68,.15)", padding:"20px 22px", textAlign:"center" }}>
          <div style={{ width:"44px", height:"44px", borderRadius:"50%", background:"rgba(239,68,68,.15)", border:"1.5px solid rgba(239,68,68,.3)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 10px" }}>
            <AlertTriangle size={22} color="#f87171"/>
          </div>
          <h3 style={{ fontSize:"16px", fontWeight:900, color:"#fff", fontFamily:"Manrope,sans-serif", marginBottom:"4px" }}>Cancel Order?</h3>
          <p style={{ fontSize:"12px", color:"rgba(255,255,255,.5)", lineHeight:1.6 }}>
            Are you sure you want to cancel order <span style={{ color:"#F5A623", fontWeight:700 }}>{orderId}</span>?<br/>This action cannot be undone.
          </p>
        </div>

        {/* Buttons */}
        <div style={{ padding:"16px 20px", display:"flex", flexDirection:"column", gap:"8px" }}>
          <button
            style={{
              width:"100%", padding:"12px", borderRadius:"10px", border:"none",
              background:"rgba(239,68,68,.15)", color:"#f87171",
              fontSize:"14px", fontWeight:800, fontFamily:"Manrope,sans-serif",
              cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:"7px",
              transition:"all .22s", border:"1.5px solid rgba(239,68,68,.25)"
            }}
            onMouseOver={e => { e.currentTarget.style.background="rgba(239,68,68,.25)"; e.currentTarget.style.borderColor="rgba(239,68,68,.5)"; }}
            onMouseOut={e  => { e.currentTarget.style.background="rgba(239,68,68,.15)"; e.currentTarget.style.borderColor="rgba(239,68,68,.25)"; }}
            onClick={onConfirmCancel}
          >
            <Trash2 size={15}/> Yes, Cancel Order
          </button>
          <button
            className="btn-primary"
            style={{ width:"100%", justifyContent:"center", padding:"12px", fontSize:"14px" }}
            onClick={onDismiss}
          >
            Keep My Order
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   ROOT
───────────────────────────────────────────────────────────────────────────── */
export default function CanteenPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [view, setView]               = useState("select");
  const [canteen, setCanteen]         = useState(null);
  const [cart, setCart]               = useState([]);
  const [cartOpen, setCartOpen]       = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [orderError, setOrderError] = useState("");

  // flow: null | "payment" | "confirmed" | "tracking" | "cancelConfirm"
  const [modal, setModal]             = useState(null);
  const [cancelledId, setCancelledId] = useState(null);
  const [lastOrder, setLastOrder]     = useState([]);
  const [payMethod, setPayMethod]     = useState(null);
  const [orderId, setOrderId]         = useState(null);
  const [mainMenuSections, setMainMenuSections] = useState(transformBackendMenu([]));
  const [menuLoading, setMenuLoading] = useState(false);
  const [menuError, setMenuError] = useState("");
  const [trackedOrder, setTrackedOrder] = useState(null);
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [trackingError, setTrackingError] = useState("");

  const fetchMainCanteenMenu = async () => {
    try {
      setMenuLoading(true);
      setMenuError("");

      const res = await api.get("/menu");
      const transformed = transformBackendMenu(res.data?.data || []);
      setMainMenuSections(transformed);
    } catch (err) {
      setMenuError(err.response?.data?.message || "Failed to load main canteen menu.");
      setMainMenuSections(transformBackendMenu([]));
    } finally {
      setMenuLoading(false);
    }
  };

  const addToCart = item => setCart(prev => {
    const ex = prev.find(c => c.id===item.id);
    return ex ? prev.map(c => c.id===item.id ? {...c,qty:c.qty+1} : c) : [...prev,{...item,qty:1}];
  });
  const removeFromCart = id => setCart(prev => {
    const ex = prev.find(c => c.id===id);
    if (!ex) return prev;
    return ex.qty===1 ? prev.filter(c => c.id!==id) : prev.map(c => c.id===id ? {...c,qty:c.qty-1} : c);
  });

  useEffect(() => {
    if (view === "menu" && canteen?.id === 1) {
      fetchMainCanteenMenu();
    }
  }, [view, canteen]);

  const getTodayPickupDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const getTomorrowPickupDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const year = tomorrow.getFullYear();
    const month = String(tomorrow.getMonth() + 1).padStart(2, "0");
    const day = String(tomorrow.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  // Cart → open payment modal
  const handleCheckout = () => {
    if (cart.length === 0) return;
    setOrderError("");
    setLastOrder(cart);
    setModal("payment");
  };

  const submitCashOrder = async () => {
    try {
      setPlacingOrder(true);
      setOrderError("");

      const payload = {
        items: cart.map((item) => ({
          menuItemId: item.id,
          quantity: item.qty,
        })),
        paymentMethod: "cash",
        pickupDate: getTodayPickupDate(),
      };

      const res = await api.post("/orders", payload);

      const createdOrder = res.data?.data;

      setOrderId(createdOrder?._id || null);
      setPayMethod("cash");
      setModal("confirmed");
      setCartOpen(false);
      setCart([]);
    } catch (err) {
      setOrderError(err.response?.data?.message || "Failed to place order.");
    } finally {
      setPlacingOrder(false);
    }
  };

  const submitBankTransferOrder = async (receipt, paymentReference) => {
    try {
      setPlacingOrder(true);
      setOrderError("");

      const formData = new FormData();

      formData.append(
        "items",
        JSON.stringify(
          cart.map((item) => ({
            menuItemId: item.id,
            quantity: item.qty,
          }))
        )
      );

      formData.append("paymentMethod", "bank_transfer");
      formData.append("pickupDate", getTomorrowPickupDate());
      formData.append("paymentReference", paymentReference);
      formData.append("slip", receipt);

      const res = await api.post("/orders", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const createdOrder = res.data?.data;

      setOrderId(createdOrder?._id || null);
      setPayMethod("bank_transfer");
      setModal("confirmed");
      setCartOpen(false);
      setCart([]);
    } catch (err) {
      setOrderError(err.response?.data?.message || "Failed to place bank transfer order.");
    } finally {
      setPlacingOrder(false);
    }
  };

  // Payment confirmed → show order confirmed
  const handlePayConfirm = async (method, receipt, paymentReference) => {
    if (method === "cash") {
      await submitCashOrder();
      return;
    }

    if (method === "bank_transfer") {
      await submitBankTransferOrder(receipt, paymentReference);
      return;
    }
  };

  const fetchTrackedOrder = async (orderIdValue) => {
    try {
      setTrackingLoading(true);
      setTrackingError("");

      const res = await api.get(`/orders/${orderIdValue}`);
      setTrackedOrder(res.data?.data || null);
    } catch (err) {
      setTrackingError(err.response?.data?.message || "Failed to load order tracking.");
      setTrackedOrder(null);
    } finally {
      setTrackingLoading(false);
    }
  };

  useEffect(() => {
    const queryOrderId = searchParams.get("trackOrderId");

    if (!queryOrderId) return;

    const openTrackedOrderFromQuery = async () => {
      await fetchTrackedOrder(queryOrderId);
      setOrderId(queryOrderId);
      setPayMethod("");
      setCanteen(CANTEENS[0]);
      setView("menu");
      setModal("tracking");
      setSearchParams({}, { replace: true });
    };

    openTrackedOrderFromQuery();
  }, [searchParams]);

  // Track My Order clicked
  const handleTrack = async () => {
    if (!orderId) return;
    await fetchTrackedOrder(orderId);
    setModal("tracking");
  };

  // Cancel order flow
  const handleCancelOrder   = () => setModal("cancelConfirm");
  const handleConfirmCancel = () => { setCancelledId(orderId); setModal("cancelled"); setTimeout(() => setModal(null), 2800); };

  const handleSelectCanteen = c => { setCanteen(c); setCart([]); setView("menu"); window.scrollTo({top:0,behavior:"instant"}); };
  const handleBackToSelect  = () => { setView("select"); setCart([]); window.scrollTo({top:0,behavior:"instant"}); };

  const currentMenuSections = canteen?.id === 1 && mainMenuSections.length > 0 ? mainMenuSections : MENU;

  const cartCount = cart.reduce((s,i) => s+i.qty, 0);
  const cartTotal = cart.reduce((s,i) => s+i.price*i.qty, 0) + 10;

  return (
    <>
      <style>{CSS}</style>
      <div style={{ width:"100%", maxWidth:"100%", overflowX:"hidden", minHeight:"100vh", background:"#07091a" }}>
        <Navbar cartCount={cartCount} onCartOpen={() => setCartOpen(true)}/>

        <div style={{ paddingTop:"66px" }}>
          {view==="select" && <CanteenSelector onSelect={handleSelectCanteen}/>}
          {view==="menu"   && canteen && (
            <MenuPage
              canteen={canteen}
              cart={cart}
              onAdd={addToCart}
              onRemove={removeFromCart}
              onBack={handleBackToSelect}
              menuSections={currentMenuSections}
              menuLoading={canteen?.id === 1 ? menuLoading : false}
              menuError={canteen?.id === 1 ? menuError : ""}
            />
          )}
        </div>

        {cartOpen && (
          <CartPanel cart={cart} canteen={canteen} onAdd={addToCart} onRemove={removeFromCart}
            onClose={() => setCartOpen(false)} onCheckout={handleCheckout}/>
        )}

        {cartCount > 0 && !cartOpen && (
          <button className="float-cart" onClick={() => setCartOpen(true)}>
            <div style={{ background:"rgba(7,9,26,.25)", borderRadius:"8px", padding:"3px 9px", fontSize:"12px", fontWeight:900 }}>{cartCount}</div>
            View Order
            <div style={{ marginLeft:"auto", fontWeight:900 }}>Rs. {cartTotal}</div>
          </button>
        )}

        {modal === "payment" && (
          <PaymentModal
            order={lastOrder}
            canteen={canteen}
            onConfirm={handlePayConfirm}
            onClose={() => {
              setOrderError("");
              setModal(null);
            }}
            placingOrder={placingOrder}
            orderError={orderError}
          />
        )}

        {modal==="confirmed" && (
          <OrderConfirmedModal
            order={lastOrder} canteen={canteen}
            payMethod={payMethod} orderId={orderId}
            onTrack={handleTrack}
            onCancel={handleCancelOrder}
            onClose={() => {
              setModal(null);
              setTrackedOrder(null);
              setTrackingError("");
            }}
          />
        )}

        {modal === "tracking" && (
          <TrackingModal
            orderId={trackedOrder?._id || orderId}
            canteen={canteen}
            payMethod={trackedOrder?.paymentMethod || payMethod}
            trackedOrder={trackedOrder}
            trackingLoading={trackingLoading}
            trackingError={trackingError}
            onClose={() => {
              setModal(null);
              setTrackedOrder(null);
              setTrackingError("");
            }}
          />
        )}

        {modal==="cancelConfirm" && (
          <CancelConfirmModal
            orderId={orderId}
            onConfirmCancel={handleConfirmCancel}
            onDismiss={() => setModal("confirmed")}
          />
        )}

        {modal==="cancelled" && (
          <div className="modal-bg">
            <div style={{ background:"#0d1130", border:"1.5px solid rgba(239,68,68,.25)", borderRadius:"20px", padding:"32px 28px", textAlign:"center", maxWidth:"320px", width:"100%", animation:"popIn .35s cubic-bezier(.22,.68,0,1.2)" }}>
              <div style={{ width:"52px", height:"52px", borderRadius:"50%", background:"rgba(239,68,68,.12)", border:"1.5px solid rgba(239,68,68,.3)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 14px" }}>
                <Trash2 size={24} color="#f87171"/>
              </div>
              <h3 style={{ fontSize:"17px", fontWeight:900, color:"#fff", fontFamily:"Manrope,sans-serif", marginBottom:"6px" }}>Order Cancelled</h3>
              <p style={{ fontSize:"13px", color:"rgba(255,255,255,.5)", lineHeight:1.65 }}>
                Order <span style={{ color:"#F5A623", fontWeight:700 }}>{cancelledId}</span> has been cancelled successfully.
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}