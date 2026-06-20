/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, RotateCcw, Trash2, ArrowRight, CornerDownRight, 
  Sparkles, Check, Lightbulb, RefreshCw, Trophy, AlertTriangle 
} from 'lucide-react';
import { CommandBlock, CommandType, GameLevel, Position } from '../types';

// Let's pre-define 3 fun, progressive levels for children
const GAME_LEVELS: GameLevel[] = [
  {
    id: 1,
    gridSize: { cols: 4, rows: 4 },
    startPos: { x: 0, y: 3 },
    startDir: 'RIGHT',
    targetPos: { x: 3, y: 3 },
    targetLightRequired: false,
    obstaclePositions: [],
    description: "Robotik dostumuz pili çok azaldı! Onu şarj ünitesine ulaştırmak için 3 adım ileri yürüt.",
    hint: "Sırasıyla 3 adet 'İleri Git' bloğu ekle ve 'Kodu Çalıştır' butonuna bas!"
  },
  {
    id: 2,
    gridSize: { cols: 4, rows: 4 },
    startPos: { x: 0, y: 3 },
    startDir: 'UP',
    targetPos: { x: 2, y: 1 },
    targetLightRequired: false,
    obstaclePositions: [
      { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 2 }
    ],
    description: "Engellere (Kırmızı Bloklar) çarpmadan sağa dönerek hedefe ulaş!",
    hint: "Önce 'İleri Git', ardından 'Sağa Dön', sonra 'İleri Git' komutlarını kullanarak engelleri aş!"
  },
  {
    id: 3,
    gridSize: { cols: 4, rows: 4 },
    startPos: { x: 0, y: 3 },
    startDir: 'RIGHT',
    targetPos: { x: 3, y: 0 },
    targetLightRequired: true,
    obstaclePositions: [
      { x: 1, y: 2 }, { x: 2, y: 1 }
    ],
    description: "Zorlu Görev! Hedefe ulaştığında şarj ünitesini aktif etmek için mutlaka 'Ampulü Yak' komutunu kullanmalısın!",
    hint: "Hedefe tam geldiğinde en sonra 'Ampulü Yak' bloğunu eklemeyi unutma!"
  }
];

const AVAILABLE_BLOCKS: { type: CommandType; label: string; color: string; description: string }[] = [
  { type: 'FORWARD', label: 'İleri Git', color: 'bg-emerald-500 hover:bg-emerald-600', description: 'Robotu baktığı yönde 1 birim ilerletir.' },
  { type: 'TURN_RIGHT', label: 'Sağa Dön ↻', color: 'bg-sky-500 hover:bg-sky-600', description: 'Robotu olduğu yerde 90 derece sağa çevirir.' },
  { type: 'TURN_LEFT', label: 'Sola Dön ↺', color: 'bg-indigo-500 hover:bg-indigo-600', description: 'Robotu olduğu yerde 90 derece sola çevirir.' },
  { type: 'LIGHT_ON', label: 'Ampulü Yak 💡', color: 'bg-amber-400 text-slate-900 hover:bg-amber-500', description: 'Gittiği karedeki elektrik ünitesini çalıştırır.' },
];

export default function CodingGame() {
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [selectedCommands, setSelectedCommands] = useState<CommandBlock[]>([]);
  const [gameState, setGameState] = useState<'idle' | 'running' | 'success' | 'fail'>('idle');
  const [robotPos, setRobotPos] = useState<Position>({ x: 0, y: 3 });
  const [robotDir, setRobotDir] = useState<'UP' | 'RIGHT' | 'DOWN' | 'LEFT'>('RIGHT');
  const [isLightOn, setIsLightOn] = useState(false);
  const [runningIndex, setRunningIndex] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  
  const level = GAME_LEVELS[currentLevelIndex];
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize or Reset the level state
  const resetLevel = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setRobotPos({ ...level.startPos });
    setRobotDir(level.startDir);
    setIsLightOn(false);
    setGameState('idle');
    setRunningIndex(null);
    setErrorMessage('');
  };

  // Keep robot reset when level changes
  useEffect(() => {
    resetLevel();
  }, [currentLevelIndex]);

  // Clean timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const addBlock = (type: CommandType, label: string, color: string) => {
    if (gameState !== 'idle') return;
    if (selectedCommands.length >= 10) {
      setErrorMessage('Maksimum 10 komut bloğu ekleyebilirsiniz!');
      return;
    }
    const newBlock: CommandBlock = {
      id: `${type}-${Date.now()}-${Math.random()}`,
      type,
      label,
      color
    };
    setSelectedCommands([...selectedCommands, newBlock]);
    setErrorMessage('');
  };

  const removeBlock = (id: string) => {
    if (gameState !== 'idle') return;
    setSelectedCommands(selectedCommands.filter(cmd => cmd.id !== id));
  };

  const clearAllBlocks = () => {
    if (gameState !== 'idle') return;
    setSelectedCommands([]);
    setErrorMessage('');
  };

  // Direction angle calculation for SVG rotation
  const getDirectionAngle = (dir: 'UP' | 'RIGHT' | 'DOWN' | 'LEFT') => {
    switch (dir) {
      case 'UP': return 270;
      case 'RIGHT': return 0;
      case 'DOWN': return 90;
      case 'LEFT': return 180;
    }
  };

  // Run the code block list
  const runCode = () => {
    if (selectedCommands.length === 0) {
      setErrorMessage('Lütfen önce kod listesine en az bir komut bloğu ekleyin!');
      return;
    }
    resetLevel();
    setGameState('running');
    setErrorMessage('');

    let step = 0;
    let currentPos = { ...level.startPos };
    let currentDir = level.startDir;
    let lampLit = false;

    timerRef.current = setInterval(() => {
      if (step >= selectedCommands.length) {
        // Evaluate ending state
        clearInterval(timerRef.current!);
        timerRef.current = null;
        setRunningIndex(null);

        const hitTarget = currentPos.x === level.targetPos.x && currentPos.y === level.targetPos.y;
        const correctLight = !level.targetLightRequired || lampLit;

        if (hitTarget && correctLight) {
          setGameState('success');
        } else if (hitTarget && !correctLight) {
          setGameState('fail');
          setErrorMessage('Hedefe ulaştın ama pili şarj etmek için en sonda "Ampulü Yak" (💡) demedin!');
        } else {
          setGameState('fail');
          setErrorMessage('Ah, robot şarj ünitesine yetişemedi! Kodlarını düzenleyip tekrar dene.');
        }
        return;
      }

      const cmd = selectedCommands[step];
      setRunningIndex(step);

      if (cmd.type === 'FORWARD') {
        let nextPos = { ...currentPos };
        if (currentDir === 'UP') nextPos.y -= 1;
        else if (currentDir === 'RIGHT') nextPos.x += 1;
        else if (currentDir === 'DOWN') nextPos.y += 1;
        else if (currentDir === 'LEFT') nextPos.x -= 1;

        // Check grid boundary collision
        const isOOB = 
          nextPos.x < 0 || nextPos.x >= level.gridSize.cols || 
          nextPos.y < 0 || nextPos.y >= level.gridSize.rows;

        // Check obstacle collision
        const isObstacle = level.obstaclePositions.some(
          obs => obs.x === nextPos.x && obs.y === nextPos.y
        );

        if (isOOB) {
          clearInterval(timerRef.current!);
          setGameState('fail');
          setErrorMessage('Eyvah! Robot sınırlardan dışarı düştü 🪫 Tekrar deneyelim!');
          return;
        }

        if (isObstacle) {
          clearInterval(timerRef.current!);
          setGameState('fail');
          setErrorMessage('Bumm! Kırmızı bir engele çarptın 🛑 Dikkatli dönmelisin.');
          return;
        }

        currentPos = nextPos;
        setRobotPos(currentPos);
      } else if (cmd.type === 'TURN_RIGHT') {
        const order: ('UP' | 'RIGHT' | 'DOWN' | 'LEFT')[] = ['UP', 'RIGHT', 'DOWN', 'LEFT'];
        let idx = order.indexOf(currentDir);
        currentDir = order[(idx + 1) % 4];
        setRobotDir(currentDir);
      } else if (cmd.type === 'TURN_LEFT') {
        const order: ('UP' | 'RIGHT' | 'DOWN' | 'LEFT')[] = ['UP', 'RIGHT', 'DOWN', 'LEFT'];
        let idx = order.indexOf(currentDir);
        currentDir = order[(idx - 1 + 4) % 4];
        setRobotDir(currentDir);
      } else if (cmd.type === 'LIGHT_ON') {
        if (currentPos.x === level.targetPos.x && currentPos.y === level.targetPos.y) {
          lampLit = true;
          setIsLightOn(true);
        } else {
          // Triggered light on wrong node
          setIsLightOn(true);
          setTimeout(() => setIsLightOn(false), 500);
        }
      }

      step++;
    }, 800);
  };

  const skipNextLevel = () => {
    setSelectedCommands([]);
    setCurrentLevelIndex((currentLevelIndex + 1) % GAME_LEVELS.length);
  };

  return (
    <section id="mini-oyun" className="py-20 bg-slate-50 relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-yellow-200/50 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-44 h-44 bg-pink-200/50 rounded-full blur-2xl translate-x-1/3 translate-y-1/3" />

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        
        {/* Title */}
        <div className="text-center mb-10">
          <span className="bg-yellow-100 text-yellow-800 text-sm font-semibold px-4 py-1.5 rounded-full inline-flex items-center gap-1.5 shadow-sm transform hover:scale-105 transition-all">
            <Sparkles className="w-4 h-4 text-yellow-500 animate-spin" /> Eğlenceli İnteraktif Atölye
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 mt-3 tracking-tight">
            Mini Robot <span className="text-indigo-600 block sm:inline">Kodlama Bulmacası</span>
          </h2>
          <p className="text-lg text-slate-600 mt-2 max-w-2xl mx-auto font-medium">
            Mühendislik temellerini oyun oynayarak deneyimleyin! Blokları sıraya dizin, robot arkadaşımızı bataryaya ulaştırın.
          </p>
        </div>

        {/* Level Selector */}
        <div className="flex justify-center flex-wrap gap-2 mb-8">
          {GAME_LEVELS.map((lvl, index) => (
            <button
              id={`lvl-btn-${lvl.id}`}
              key={lvl.id}
              onClick={() => {
                if (gameState === 'running') return;
                setCurrentLevelIndex(index);
              }}
              disabled={gameState === 'running'}
              className={`px-4 py-2.5 rounded-2xl font-bold text-sm transition-all shadow-sm ${
                currentLevelIndex === index
                  ? 'bg-indigo-600 text-white translate-y-[-2px] ring-4 ring-indigo-200'
                  : 'bg-white text-slate-700 hover:bg-slate-100 active:translate-y-0 disabled:opacity-50'
              }`}
            >
              Görev {lvl.id} {index < currentLevelIndex && '✅'}
            </button>
          ))}
        </div>

        {/* Game Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Block: Instructions & Toolbox */}
          <div className="lg:col-span-4 flex flex-col justify-between bg-white border border-slate-100 p-6 rounded-3xl shadow-xl shadow-slate-200/50 relative">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center font-black text-orange-600">
                  {level.id}
                </div>
                <h3 className="font-extrabold text-slate-900 text-lg">Seviye Açıklaması</h3>
              </div>
              <p className="text-slate-700 font-medium text-sm leading-relaxed mb-4 bg-orange-50/70 p-3.5 rounded-2xl border border-orange-100/60">
                {level.description}
              </p>

              <div className="mt-6">
                <h4 className="font-extrabold text-slate-800 text-xs tracking-wider uppercase mb-3 flex items-center gap-1">
                  <Lightbulb className="w-3.5 h-3.5 text-yellow-500 fill-yellow-200" /> Komut Paleti
                </h4>
                <div className="grid grid-cols-1 gap-2.5">
                  {AVAILABLE_BLOCKS.map(block => (
                    <button
                      id={`block-add-${block.type}`}
                      key={block.type}
                      disabled={gameState !== 'idle'}
                      onClick={() => addBlock(block.type, block.label, block.color)}
                      className={`w-full text-left transition-all p-3 rounded-2xl text-white font-extrabold flex justify-between items-center text-sm shadow-sm hover:translate-x-1 active:translate-x-0 ${block.color} ${
                        gameState !== 'idle' ? 'opacity-50 cursor-not-allowed transform-none' : ''
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <CornerDownRight className="w-4 h-4 text-white/80" />
                        {block.label}
                      </span>
                      <span className="text-[10px] bg-white/25 py-0.5 px-2 rounded-full font-normal hidden sm:block">Ekle +</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-100">
              <span className="text-xs text-slate-400 font-semibold flex items-center gap-1.5 leading-relaxed">
                <HelpCircleIcon className="w-4 h-4 shrink-0 text-slate-300" />
                <span className="italic">İpucu: {level.hint}</span>
              </span>
            </div>
          </div>

          {/* Center Block: Coding Console (Visual list of instructions) */}
          <div className="lg:col-span-4 bg-slate-900 text-white rounded-3xl p-6 shadow-2xl flex flex-col justify-between min-h-[400px]">
            <div>
              <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-3.5 h-3.5 bg-red-400 rounded-full" />
                  <div className="w-3.5 h-3.5 bg-yellow-400 rounded-full" />
                  <div className="w-3.5 h-3.5 bg-emerald-400 rounded-full" />
                  <span className="font-mono text-xs text-slate-400 ml-2 font-black">Yazılım Editörü</span>
                </div>
                <button
                  id="clear-blocks-btn"
                  onClick={clearAllBlocks}
                  disabled={selectedCommands.length === 0 || gameState !== 'idle'}
                  className="text-xs text-slate-400 hover:text-red-400 transition-colors flex items-center gap-1 disabled:opacity-30 disabled:hover:text-slate-400"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Temizle
                </button>
              </div>

              {/* Added Sequence of Blocks */}
              <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
                {selectedCommands.length === 0 ? (
                  <div className="py-12 text-center text-slate-500 border-2 border-dashed border-slate-800 rounded-2xl flex flex-col items-center justify-center">
                    <ArrowDownIcon className="w-8 h-8 text-slate-700 mb-2 animate-bounce" />
                    <p className="text-xs font-mono font-bold">Kod kutusu boş!</p>
                    <p className="text-[10px] mt-1 text-slate-600">Yandaki butonlarla komut ekle.</p>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <AnimatePresence>
                      {selectedCommands.map((cmd, idx) => (
                        <motion.div
                          id={`selected-block-${idx}`}
                          key={cmd.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          className={`flex items-center justify-between p-2.5 rounded-xl font-mono text-xs font-black relative ${cmd.color} ${
                            runningIndex === idx ? 'ring-4 ring-yellow-400 shadow-lg scale-102 z-10' : ''
                          }`}
                        >
                          <span className="flex items-center gap-2 text-white">
                            <span className="bg-black/30 w-5 h-5 rounded-full flex items-center justify-center font-sans font-bold">
                              {idx + 1}
                            </span>
                            {cmd.label}
                          </span>
                          <button
                            id={`remove-block-${idx}`}
                            onClick={() => removeBlock(cmd.id)}
                            disabled={gameState !== 'idle'}
                            className="text-white/60 hover:text-white bg-black/10 hover:bg-black/20 p-1 rounded-md transition-colors disabled:opacity-0"
                          >
                            ✖
                          </button>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            </div>

            {/* Run CTA Buttons */}
            <div className="mt-6 pt-4 border-t border-slate-800 space-y-3">
              {errorMessage && (
                <div className="text-xs text-amber-300 bg-amber-500/10 border border-amber-500/20 p-3 rounded-xl flex items-start gap-1.5 animate-bounce">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
                  <span className="font-semibold">{errorMessage}</span>
                </div>
              )}

              <div className="flex gap-2">
                <button
                  id="ctrl-run-btn"
                  onClick={runCode}
                  disabled={gameState === 'running'}
                  className={`flex-1 py-3.5 rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95 duration-100 ${
                    gameState === 'running'
                      ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                      : 'bg-emerald-500 hover:bg-emerald-400 text-slate-900 active:scale-[0.98]'
                  }`}
                >
                  <Play className="w-4 h-4 text-slate-900 fill-slate-900" /> Kodu Çalıştır!
                </button>
                
                <button
                  id="ctrl-reset-btn"
                  onClick={resetLevel}
                  disabled={gameState === 'running'}
                  className="bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 p-3.5 rounded-2xl flex items-center justify-center transition-transform active:scale-95"
                  title="Robotu Başlangıca Getir"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Block: Interactive Game Field / Map Visualizer */}
          <div className="lg:col-span-4 bg-indigo-900 border border-indigo-950 rounded-3xl p-6 shadow-2xl relative flex flex-col justify-between items-center overflow-hidden min-h-[400px]">
            {/* Space Grid design */}
            <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1.5px,transparent_1.5px)] [background-size:20px_20px]" />
            
            {/* Upper state details */}
            <div className="w-full relative z-10 flex justify-between items-center text-white mb-4">
              <span className="font-bold text-xs bg-indigo-950 px-3 py-1 rounded-full border border-indigo-800/60 font-mono">
                MAP SIZE: {level.gridSize.cols}x{level.gridSize.rows}
              </span>
              <span className={`font-black text-xs px-3 py-1 rounded-full flex items-center gap-1 ${
                gameState === 'success' ? 'bg-emerald-500 text-slate-950' : 
                gameState === 'fail' ? 'bg-red-500 text-white animate-pulse' :
                gameState === 'running' ? 'bg-amber-400 text-slate-950 animate-pulse' : 'bg-slate-800 text-slate-300'
              }`}>
                {gameState === 'idle' && 'READY'}
                {gameState === 'running' && 'DRIVING...'}
                {gameState === 'success' && 'MISSION PASSED!'}
                {gameState === 'fail' && 'COLLISION / ERROR'}
              </span>
            </div>

            {/* Grid Map Render */}
            <div className="relative z-10 w-full aspect-square max-w-[280px] bg-indigo-950 p-2.5 rounded-2xl border border-indigo-800 shadow-inner flex flex-col justify-between">
              <div className="grid grid-cols-4 grid-rows-4 gap-1.5 w-full h-full relative">
                
                {/* Visual Cells */}
                {Array.from({ length: level.gridSize.rows }).map((_, row) => (
                  <div key={row} className="contents">
                    {Array.from({ length: level.gridSize.cols }).map((_, col) => {
                      const isTarget = level.targetPos.x === col && level.targetPos.y === row;
                      const isObstacle = level.obstaclePositions.some(obs => obs.x === col && obs.y === row);
                      const isTargetLit = isTarget && isLightOn;

                      return (
                        <div
                          key={`${col}-${row}`}
                          className={`relative rounded-lg flex items-center justify-center transition-all ${
                            isObstacle 
                              ? 'bg-red-500/80 border border-red-400 shadow-md shadow-red-500/20' 
                              : isTarget 
                              ? 'bg-yellow-500/10 border-2 border-yellow-400 shadow-lg shadow-yellow-500/15'
                              : 'bg-indigo-900/30 border border-indigo-800/20'
                          }`}
                        >
                          {/* target visualization */}
                          {isTarget && (
                            <div className="flex flex-col items-center">
                              {/* Battery representation */}
                              <div className={`w-8 h-8 rounded-md flex items-center justify-center ${isTargetLit ? 'bg-yellow-400 text-slate-900 scale-110' : 'bg-slate-800 text-yellow-400'} transition-all duration-300`}>
                                <Trophy className={`w-5 h-5 ${isTargetLit ? 'animate-bounce text-slate-900' : 'text-yellow-400'}`} />
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}

                {/* Animated Cute Robot Rendering over Grid absolute */}
                <motion.div
                  id="game-robot"
                  className="absolute pointer-events-none"
                  initial={false}
                  animate={{
                    left: `${(robotPos.x * 25) + 2.5}%`,
                    top: `${(robotPos.y * 25) + 2.5}%`,
                    rotate: getDirectionAngle(robotDir)
                  }}
                  transition={{ type: 'spring', stiffness: 120, damping: 15 }}
                  style={{
                    width: '20%',
                    height: '20%',
                  }}
                >
                  {/* SVG robot body design */}
                  <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_2px_8px_rgba(255,255,255,0.4)]">
                    {/* Head antennae */}
                    <rect x="44" y="2" width="12" height="15" fill="#facc15" rx="2" />
                    <circle cx="50" cy="5" r="4" fill="#ef4444" />
                    {/* Ears */}
                    <rect x="15" y="32" width="10" height="20" fill="#a5b4fc" rx="4" />
                    <rect x="75" y="32" width="10" height="20" fill="#a5b4fc" rx="4" />
                    {/* Main Head */}
                    <rect x="22" y="16" width="56" height="50" fill="#fbbf24" rx="14" stroke="#4f46e5" strokeWidth="4" />
                    {/* Eye Screen */}
                    <rect x="32" y="26" width="36" height="20" fill="#1e1b4b" rx="6" />
                    {/* Cute glowing eyes depending on states */}
                    {gameState === 'fail' ? (
                      <>
                        <path d="M 37 36 L 43 42 M 43 36 L 37 42" stroke="#ef4444" strokeWidth="3.5" strokeLinecap="round" />
                        <path d="M 57 36 L 63 42 M 63 36 L 57 42" stroke="#ef4444" strokeWidth="3.5" strokeLinecap="round" />
                      </>
                    ) : gameState === 'success' ? (
                      <>
                        <path d="M 36 40 Q 40 34 44 40" fill="none" stroke="#22c55e" strokeWidth="4.5" strokeLinecap="round" />
                        <path d="M 56 40 Q 60 34 64 40" fill="none" stroke="#22c55e" strokeWidth="4.5" strokeLinecap="round" />
                      </>
                    ) : (
                      <>
                        <circle cx="40" cy="36" r="4" fill="#38bdf8" className="animate-pulse" />
                        <circle cx="60" cy="36" r="4" fill="#38bdf8" className="animate-pulse" />
                      </>
                    )}
                    {/* Cheerful Mouth */}
                    {gameState === 'fail' ? (
                      <path d="M 42 54 L 58 54" stroke="#ef4444" strokeWidth="3.5" strokeLinecap="round" />
                    ) : (
                      <path d="M 42 50 Q 50 58 58 50" fill="none" stroke="#312e81" strokeWidth="4" strokeLinecap="round" />
                    )}
                    {/* Cute cheeks */}
                    <circle cx="28" cy="46" r="2.5" fill="#f43f5e" />
                    <circle cx="72" cy="46" r="2.5" fill="#f43f5e" />
                    {/* Body collar */}
                    <path d="M30 66 L70 66 L60 85 L40 85 Z" fill="#6366f1" />
                    {/* Glow effect on correct power node */}
                    {isLightOn && (
                      <circle cx="50" cy="50" r="48" fill="none" stroke="#fbbf24" strokeWidth="4" strokeDasharray="8 4" className="animate-spin" />
                    )}
                  </svg>
                </motion.div>
              </div>
            </div>

            {/* Overlays for success/fail states */}
            <AnimatePresence>
              {gameState === 'success' && (
                <motion.div
                  id="level-success-modal"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="absolute inset-0 z-25 bg-emerald-500 flex flex-col items-center justify-center p-6 text-center text-slate-950"
                >
                  <Trophy className="w-16 h-16 text-yellow-300 animate-bounce mb-3" />
                  <h4 className="text-2xl font-black tracking-tight">Harika İştir! 🎉</h4>
                  <p className="font-semibold text-sm mt-1 max-w-xs">
                    Kodu optimize ettin ve robotumuzu bataryaya güvenle bağladın!
                  </p>
                  
                  <div className="mt-6 flex flex-col gap-2 w-full max-w-xs">
                    {currentLevelIndex < GAME_LEVELS.length - 1 ? (
                      <button
                        id="next-level-btn"
                        onClick={skipNextLevel}
                        className="w-full bg-slate-950 text-white font-extrabold py-3 px-5 rounded-2xl flex items-center justify-center gap-2 hover:bg-slate-900 transition-colors shadow-lg active:scale-95"
                      >
                        Sonraki Seviyeyi Aç! <ArrowRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        id="level-restart-all-btn"
                        onClick={() => {
                          setSelectedCommands([]);
                          setCurrentLevelIndex(0);
                          resetLevel();
                        }}
                        className="w-full bg-slate-950 text-white font-extrabold py-3 px-5 rounded-2xl flex items-center justify-center gap-2 hover:bg-slate-900 transition-colors shadow-lg active:scale-95"
                      >
                        En Baştan Tekrar Oyna <RefreshCw className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      id="close-success-btn"
                      onClick={resetLevel}
                      className="text-xs font-bold text-slate-800 underline mt-2"
                    >
                      Kodu İncele / Tekrar Et
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {gameState === 'fail' && (
              <div className="absolute inset-x-4 bottom-4 z-20 bg-slate-900 border border-red-500/30 p-4 rounded-2xl flex items-start gap-3">
                <div className="bg-red-500/20 p-2 rounded-lg text-red-400 shrink-0">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="font-extrabold text-sm text-white">Görev Başarısız!</h5>
                  <p className="text-slate-300 text-xs mt-1 leading-relaxed">
                    Robotumuz tam şarj ünitesine kavuşamadı ya da engellere çarptı.
                  </p>
                  <button
                    id="map-retry-btn"
                    onClick={resetLevel}
                    className="text-yellow-400 font-extrabold text-xs mt-2 underline block cursor-pointer"
                  >
                    Hemen Tekrar Dene!
                  </button>
                </div>
              </div>
            )}

            {/* Micro details */}
            <div className="w-full text-center mt-3 text-indigo-300 font-medium text-xs">
              Mühendisler Gibi Algoritmanı Kur!
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

// Inline minor helper icons to save code volume/imports
function ArrowDownIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 5v14M19 12l-7 7-7-7" />
    </svg>
  );
}

function HelpCircleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}
