"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { QRCodeSVG } from "qrcode.react";

const AEON_MIN = 1;
const AEON_MAX = 100;
const THEMES = [
  "cyberpunk",
  "minimal",
  "rock",
  "neon",
  "cosmic",
  "vapor",
];

function getRandomAeonNumber() {
  return Math.floor(Math.random() * (AEON_MAX - AEON_MIN + 1)) + AEON_MIN;
}

function padAeonNumber(num: number) {
  return `Aeon${num.toString().padStart(4, "0")}`;
}

function isValidAeonNumber(num: number) {
  return num >= AEON_MIN && num <= AEON_MAX;
}

function encodeTicketData(data: any) {
  return encodeURIComponent(btoa(JSON.stringify(data)));
}

function decodeTicketData(str: string) {
  try {
    return JSON.parse(atob(decodeURIComponent(str)));
  } catch {
    return null;
  }
}

interface ThemeStyles {
  leftBg: string;
  rightBg: string;
  textColor: string;
  headingColor: string;
  labelColor: string;
  separatorGradient: string;
  qrBg: string;
}

const themeStyles: { [key: string]: ThemeStyles } = {
 
  cyberpunk: {
    leftBg: "bg-gradient-to-b from-fuchsia-600 via-cyan-500 to-yellow-400",
    rightBg: "bg-black",
    textColor: "text-cyan-400",
    headingColor: "text-fuchsia-500",
    labelColor: "text-cyan-600",
    separatorGradient: "from-cyan-400 to-fuchsia-500",
    qrBg: "bg-gray-900"
  },
  rock: {
    leftBg: "bg-gradient-to-b from-stone-900 via-red-800 to-stone-900",
    rightBg: "bg-stone-900",
    textColor: "text-stone-300",
    headingColor: "text-red-500",
    labelColor: "text-stone-400",
    separatorGradient: "from-red-500 to-stone-700",
    qrBg: "bg-stone-800"
  },
  neon: {
    leftBg: "bg-gradient-to-b from-blue-600 via-purple-600 to-pink-600",
    rightBg: "bg-gray-900",
    textColor: "text-blue-300",
    headingColor: "text-pink-300",
    labelColor: "text-purple-400",
    separatorGradient: "from-blue-400 to-pink-400",
    qrBg: "bg-gray-800"
  },
  cosmic: {
    leftBg: "bg-gradient-to-b from-indigo-900 via-purple-900 to-violet-800",
    rightBg: "bg-gray-950",
    textColor: "text-indigo-200",
    headingColor: "text-violet-200",
    labelColor: "text-purple-300",
    separatorGradient: "from-indigo-400 to-violet-500",
    qrBg: "bg-gray-900"
  },
  vapor: {
    leftBg: "bg-gradient-to-b from-pink-400 via-purple-400 to-cyan-400",
    rightBg: "bg-purple-900",
    textColor: "text-cyan-300",
    headingColor: "text-pink-300",
    labelColor: "text-purple-300",
    separatorGradient: "from-pink-300 to-cyan-300",
    qrBg: "bg-purple-800"
  },
  minimal: {
    leftBg: "bg-gradient-to-b from-blue-700 to-blue-900",
    rightBg: "bg-white",
    textColor: "text-cyan-600",
    headingColor: "text-blue-900",
    labelColor: "text-cyan-600",
    separatorGradient: "from-blue-300 to-blue-400",
    qrBg: "bg-gray-100"
  }
};

export default function TicketPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [form, setForm] = useState<null | {
    wallet: string;
    name: string;
    event: string;
    aeon: number;
    theme: string;
    date: string;
    passType: string;
  }>(null);
  const [aeonInput, setAeonInput] = useState("");
  const [error, setError] = useState("");
  const [shareUrl, setShareUrl] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ticket = params.get("ticket");
    
    if (ticket) {
      const decoded = decodeTicketData(ticket);
      console.log(ticket)
      if (decoded) {
        console.log("inside")
        setForm(decoded);
        setShowForm(false);
      }
    } else {
      setForm({
        wallet: "J3NKxxXZcnNiMjKw9hYb2K4LUxgwB6t1FtPtQVsv3KFr",
        name: "Marie Rose",
        event: "Aeon Summer '25",
        aeon: getRandomAeonNumber(),
        theme: "neon",
        date: new Date().toISOString().split('T')[0],
        passType: "Cognisphere"
      });
      setShowForm(true);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (form) {
      setShareUrl(`${window.location.origin}?ticket=${encodeTicketData(form)}`);
    }
  }, [form]);

  if (isLoading || !form) {
    return null
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm((f) => {
      if (!f) return null;
      return { ...f, [name]: value }
    });
  }

  function handleThemeChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setForm((f) => {
      if (!f) return null;
      return { ...f, theme: e.target.value };
    });
  }

  function handleRandomAeon() {
    setForm((f) => {
      if (!f) return null;
      return { ...f, aeon: getRandomAeonNumber() };
    });
    setAeonInput("");
  }

  function handleAeonInput(e: React.ChangeEvent<HTMLInputElement>) {
    setAeonInput(e.target.value);
  }

  function handleAeonSet() {
    const num = parseInt(aeonInput, 10);
    if (isValidAeonNumber(num)) {
      setForm((f) => {
        if (!f) return null;
        return { ...f, aeon: num };
      });
      setError("");
    } else {
      setError(`Aeon number must be between ${AEON_MIN} and ${AEON_MAX}`);
    }
  }

  function QrCode({ value }: { value: string }) {
    return (
      <QRCodeSVG
        value={value || "No wallet address"}
        size={96}
        level="H"
        includeMargin={true}
        className="bg-white"
      />
    );
  }

  const aeonImage = `/aeon/${padAeonNumber(form.aeon)}.png`;

  function Ticket() {
    const theme = themeStyles[form?.theme || "neon"] || themeStyles['elegant'];
    
    return (
      <div className="w-full max-w-4xl h-[75vh] md:h-auto flex flex-col md:flex-row rounded-lg overflow-hidden shadow-2xl">
        <div className={`w-full h-[35vh] md:h-auto md:w-1/4 ${theme.leftBg} relative`}>
          <div className="absolute inset-0 flex items-center justify-center">
            <Image 
              src={aeonImage} 
              alt="Aeon" 
              width={300} 
              height={300} 
              className="object-cover w-full h-full"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/aeon/Aeon0001.png";
              }}
            />
          </div>
          <div className={`absolute md:right-0 bottom-0 md:bottom-auto md:top-0 w-full md:w-1 h-1 md:h-full bg-gradient-to-r md:bg-gradient-to-b ${theme.separatorGradient}`}></div>
        </div>

        <div className={`w-full h-[25vh] md:h-auto md:w-2/4 ${theme.rightBg} p-6 md:p-8 flex flex-col justify-between relative`}>
          <div className="h-full flex flex-col justify-between">
            <div>
              <h1 className={`text-xl md:text-3xl font-bold tracking-tight ${theme.headingColor} mb-1`}>{form?.event}</h1>
              <p className={`text-xs md:text-sm ${theme.labelColor} mb-4 md:mb-6`}>
                {new Date(form?.date || "").toLocaleDateString('en-US', { 
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                }).toUpperCase()} • {form?.passType}
              </p>
              
              <div className="space-y-2 md:space-y-4">
                <div>
                  <p className={`text-xs md:text-sm font-medium ${theme.labelColor}`}>ATTENDEE</p>
                  <p className={`text-base md:text-lg font-semibold ${theme.textColor}`}>
                    {form?.name || <span className="text-gray-400">Your Name</span>}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex md:hidden items-center gap-4 mt-4">
              <div className={`p-2 rounded ${theme.qrBg}`}>
                <QrCode value={form?.wallet || ""} />
              </div>
              <div className="flex-1">
                <p className={`text-xs font-medium ${theme.labelColor}`}>WALLET</p>
                <p className={`text-xs font-mono break-all ${theme.textColor}`}>
                  {form?.wallet ? 
                    `${form.wallet.slice(0, 6)}...${form.wallet.slice(-4)}` : 
                    <span className="text-gray-400">Wallet Address</span>
                  }
                </p>
              </div>
            </div>

            <div className="mt-auto">
              <div className={`w-full h-4 bg-[repeating-linear-gradient(90deg,${theme.rightBg},${theme.rightBg}_4px,transparent_4px,transparent_8px)]`}></div>
            </div>
          </div>
        </div>

        <div className={`hidden md:flex w-1/4 ${theme.rightBg} p-4 md:p-6 flex-col justify-between relative border-l border-gray-200`}>
          <div className="h-full flex flex-col justify-between items-center">
            <div className={`p-2 rounded ${theme.qrBg}`}>
              <QrCode value={form?.wallet || ""} />
            </div>
            
            <div className="w-full text-center mt-4">
              <p className={`text-xs md:text-sm font-medium ${theme.labelColor}`}>WALLET</p>
              <p className={`text-xs font-mono break-all ${theme.textColor}`}>
                {form?.wallet || <span className="text-gray-400">Wallet Address</span>}
              </p>
            </div>

            <div className="w-full mt-auto">
              <div className={`w-full h-4 bg-[repeating-linear-gradient(90deg,${theme.rightBg},${theme.rightBg}_4px,transparent_4px,transparent_8px)]`}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 bg-gradient-to-br from-gray-900 to-gray-700">
      {!isLoading && (
        showForm ? (
          <div className="flex flex-col gap-8 w-full max-w-4xl">
            <form className="flex-1 space-y-6 bg-white/10 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-white/20 mb-8" onSubmit={e => e.preventDefault()}>
              

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block font-medium text-white">Wallet Address</label>
                  <div className="relative">
                    <input
                      className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      name="wallet"
                      value={form.wallet}
                      onChange={handleChange}
                      placeholder="Wallet address"
                    />
                    
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block font-medium text-white">Name</label>
                  <input
                    className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your name"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block font-medium text-white">Event</label>
                  <input
                    className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    name="event"
                    value={form.event}
                    onChange={handleChange}
                    placeholder="Event name"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block font-medium text-white">Event Date</label>
                  <input
                    type="date"
                    className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    name="date"
                    value={form.date}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <label className="block font-medium text-white">Location</label>
                  <input
                    className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    name="passType"
                    value={form.passType}
                    onChange={handleChange}
                    placeholder="e.g. ALL DAY PASS"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block font-medium text-white">Theme</label>
                  <select
                    className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none cursor-pointer"
                    name="theme"
                    value={form.theme}
                    onChange={handleThemeChange}
                  >
                    {THEMES.map((theme) => (
                      <option key={theme} value={theme} className="bg-gray-800">
                        {theme.charAt(0).toUpperCase() + theme.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="block font-medium text-white">Aeon Image</label>
                  <div className="flex flex-col gap-3">
                    <div>
                      <button 
                        type="button" 
                        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-colors duration-200 flex items-center gap-2" 
                        onClick={handleRandomAeon}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Random
                      </button>
                    </div>
                    <div className="flex gap-3 items-center">
                      <div className="w-[150px]">
                        <input
                          className="w-full bg-white/5 border border-white/10 px-3 py-2 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          type="number"
                          min={AEON_MIN}
                          max={AEON_MAX}
                          value={aeonInput}
                          onChange={handleAeonInput}
                          placeholder={form.aeon.toString()}
                        />
                      </div>
                      <button 
                        type="button" 
                        className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl transition-colors duration-200 flex items-center gap-2" 
                        onClick={handleAeonSet}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Set
                      </button>
                    </div>
                  </div>
                  {error && <div className="text-red-400 text-xs mt-1">{error}</div>}
                </div>
              </div>
            </form>

            <div className="relative">
              <div className="absolute -top-6 left-0 text-sm text-gray-400">Preview</div>
              <Ticket />
            </div>

            <div className="mt-3 mb-8 w-full max-w-4xl">
              <label className="block font-semibold mb-1 text-white">Shareable URL</label>
              <div className="flex flex-col gap-2">
                <div className="w-full border p-2 rounded bg-white/5 text-white/90 overflow-hidden overflow-ellipsis whitespace-nowrap">
                  {shareUrl.length > 60 ? `${shareUrl.substring(0, 50)}...${shareUrl.substring(shareUrl.length - 10)}` : shareUrl}
                </div>
                <div className="flex justify-start gap-2">
                  <button
                    type="button"
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition whitespace-nowrap"
                    onClick={async () => {
                      if (navigator.clipboard && navigator.clipboard.writeText) {
                        await navigator.clipboard.writeText(shareUrl);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 1500);
                      } else {
                        const input = document.createElement('input');
                        input.value = shareUrl;
                        document.body.appendChild(input);
                        input.select();
                        document.execCommand('copy');
                        document.body.removeChild(input);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 1500);
                      }
                    }}
                  >
                    {copied ? "Copied!" : "Copy"}
                  </button>
                  <button
                    type="button"
                    className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-900 transition whitespace-nowrap"
                    onClick={() => window.open(shareUrl, '_blank')}
                  >
                    Open
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Ticket />
          </div>
        )
      )}
    </div>
  );
}

