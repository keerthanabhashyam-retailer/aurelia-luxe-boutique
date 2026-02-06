
import React, { useState, useRef } from 'react';
import { Icons } from '../constants';

interface SpecialRequestProps {
  onSync?: (data: any) => void;
}

const SpecialRequest: React.FC<SpecialRequestProps> = ({ onSync }) => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    description: '',
    quantity: 1,
    dueDate: '',
    view: 'Traditional'
  });
  const [photo, setPhoto] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startCamera = async () => {
    setIsCameraOpen(true);
    setPhoto(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment', width: 1280, height: 720 } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera access denied", err);
      alert("Please ensure you've allowed camera permissions in your browser settings.");
      setIsCameraOpen(false);
    }
  };

  const takeSnap = () => {
    if (videoRef.current && canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      const video = videoRef.current;
      // High-quality capture for Drive
      canvasRef.current.width = video.videoWidth;
      canvasRef.current.height = video.videoHeight;
      ctx?.drawImage(video, 0, 0);
      const dataUrl = canvasRef.current.toDataURL('image/jpeg', 0.9);
      setPhoto(dataUrl);
      stopCamera();
    }
  };

  const stopCamera = () => {
    const stream = videoRef.current?.srcObject as MediaStream;
    stream?.getTracks().forEach(track => track.stop());
    setIsCameraOpen(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result as string);
        setIsCameraOpen(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!form.description || !form.dueDate) {
      alert("Please complete all required fields.");
      return;
    }
    const requestData = { 
        ...form, 
        image: photo, // This base64 string will be handled by uploadImageToDrive via syncToSheets
        timestamp: Date.now() 
    };
    if (onSync) await onSync(requestData);
    
    alert("Request submitted! Your design has been securely stored in our Google Drive archives.");
    setStep(1);
    setPhoto(null);
    setForm({ description: '', quantity: 1, dueDate: '', view: 'Traditional' });
  };

  return (
    <div className="max-w-3xl mx-auto animate-in slide-in-from-bottom-8 duration-500 pb-20">
      <div className="bg-white rounded-[2.5rem] p-10 md:p-14 border border-stone-100 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-amber-50 rounded-bl-[100%] z-0"></div>
        <div className="relative z-10">
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-amber-100 text-amber-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm"><Icons.Plus /></div>
            <h2 className="text-4xl font-serif font-bold text-stone-800 mb-4">Bespoke Design Service</h2>
            <p className="text-stone-400 max-w-md mx-auto text-sm leading-relaxed">Collaborate with our master craftsmen to create a unique masterpiece stored in our secure digital atelier.</p>
          </div>

          <div className="flex gap-3 mb-12 justify-center">
            {[1, 2, 3].map(s => <div key={s} className={`h-1.5 w-16 rounded-full transition-all duration-500 ${step >= s ? 'bg-amber-600' : 'bg-stone-100'}`} />)}
          </div>

          {step === 1 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
              <div className="space-y-4">
                <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-widest">The Vision</label>
                <textarea placeholder="Describe your dream piece..." className="w-full p-6 bg-stone-50 border border-stone-200 rounded-3xl min-h-[180px] outline-none focus:ring-2 focus:ring-amber-500" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
              </div>
              <button disabled={!form.description} onClick={() => setStep(2)} className="w-full bg-stone-900 text-white py-5 rounded-2xl font-bold hover:bg-amber-600 transition-all shadow-xl disabled:bg-stone-200">Continue to Aesthetics</button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-widest">Reference (Drive Storage)</label>
                  <div className="relative aspect-square bg-stone-50 rounded-3xl border-2 border-dashed border-stone-200 flex flex-col items-center justify-center overflow-hidden group">
                    {photo ? (
                      <div className="relative w-full h-full">
                        <img src={photo} alt="Preview" className="w-full h-full object-cover" />
                        <button onClick={() => setPhoto(null)} className="absolute top-4 right-4 p-3 bg-white text-red-500 rounded-full shadow-lg"><Icons.Trash /></button>
                      </div>
                    ) : isCameraOpen ? (
                      <div className="w-full h-full relative bg-black">
                        <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-4">
                          <button onClick={takeSnap} className="bg-amber-600 text-white p-5 rounded-full shadow-2xl border-4 border-white/20"><Icons.Camera /></button>
                          <button onClick={stopCamera} className="bg-white/20 backdrop-blur-md text-white p-5 rounded-full">✕</button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-4 p-8 text-center">
                        <Icons.Camera />
                        <p className="text-[10px] text-stone-400 uppercase tracking-widest">Snap or Upload</p>
                        <div className="flex gap-3">
                          <button onClick={startCamera} className="bg-stone-900 text-white px-5 py-2.5 rounded-xl text-[10px] font-bold uppercase hover:bg-amber-600 transition-all">Camera</button>
                          <button onClick={() => fileInputRef.current?.click()} className="bg-white text-stone-800 border border-stone-200 px-5 py-2.5 rounded-xl text-[10px] font-bold uppercase hover:bg-stone-50 transition-all">Files</button>
                        </div>
                        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />
                      </div>
                    )}
                    <canvas ref={canvasRef} className="hidden" />
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-widest">Style Philosophy</label>
                    <select className="w-full p-5 bg-stone-50 border border-stone-200 rounded-2xl outline-none focus:ring-2 focus:ring-amber-500" value={form.view} onChange={e => setForm({...form, view: e.target.value})}><option>Traditional / Classic</option><option>Modern / Avant-Garde</option></select>
                  </div>
                  <div className="space-y-4">
                    <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-widest">Quantity</label>
                    <input type="number" min="1" className="w-full p-5 bg-stone-50 border border-stone-200 rounded-2xl outline-none focus:ring-2 focus:ring-amber-500" value={form.quantity} onChange={e => setForm({...form, quantity: Number(e.target.value)})} />
                  </div>
                </div>
              </div>
              <div className="flex gap-4">
                <button onClick={() => setStep(1)} className="flex-1 bg-stone-100 text-stone-600 py-5 rounded-2xl font-bold">Return</button>
                <button onClick={() => setStep(3)} className="flex-[2] bg-stone-900 text-white py-5 rounded-2xl font-bold hover:bg-amber-600 shadow-xl">Confirm Delivery</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 text-center">
              <div className="space-y-4">
                <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-widest">Requested Due Date</label>
                <input type="date" className="w-full p-6 bg-stone-50 border border-stone-200 rounded-3xl outline-none focus:ring-2 focus:ring-amber-500" value={form.dueDate} onChange={e => setForm({...form, dueDate: e.target.value})} />
              </div>
              <div className="flex gap-4 pt-4">
                <button onClick={() => setStep(2)} className="flex-1 bg-stone-100 text-stone-600 py-5 rounded-2xl font-bold">Return</button>
                <button onClick={handleSubmit} className="flex-[2] bg-amber-600 text-white py-5 rounded-2xl font-bold hover:bg-amber-700 shadow-xl">Finalize Request</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SpecialRequest;
