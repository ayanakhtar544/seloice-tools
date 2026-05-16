'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Link as LinkIcon, Loader2, AlertCircle, Heart, Eye, User, AlignLeft, Settings2 } from 'lucide-react';
import ToolInterfaceShell from '@/components/seo/ToolInterfaceShell';

interface IgMeta {
  author: string;
  caption: string;
  likes: number;
  views: number;
  thumbnail: string;
}

interface IgVideo {
  url: string;
  quality: string;
  extension: string;
}

const fetchJsonWithRetry = async (
  input: RequestInfo | URL,
  init: RequestInit,
  retries = 1
) => {
  let lastError: unknown;

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 25_000);

    try {
      const response = await fetch(input, {
        ...init,
        signal: controller.signal,
      });
      const data = await response.json().catch(() => null);

      if (!response.ok || !data?.success) {
        const message =
          data?.error ||
          'Could not load this reel. The account may be private or the link invalid.';
        if (attempt === retries) {
          throw new Error(message);
        }
        lastError = new Error(message);
      } else {
        return data as {
          success: true;
          meta: IgMeta;
          availableVideos: IgVideo[];
          videoUrl: string;
        };
      }
    } catch (error) {
      lastError = error;
      if (attempt === retries) {
        throw error;
      }
    } finally {
      window.clearTimeout(timeoutId);
    }
  }

  throw lastError instanceof Error ? lastError : new Error('Request failed.');
};

export default function ReelDownloaderClient() {
  const [url, setUrl] = useState('');
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState('');
  const [metaData, setMetaData] = useState<IgMeta | null>(null);
  const [availableVideos, setAvailableVideos] = useState<IgVideo[]>([]);
  const [selectedVideoUrl, setSelectedVideoUrl] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleFetch = async () => {
    setError('');
    setMetaData(null);
    setAvailableVideos([]);
    setSelectedVideoUrl(null);

    if (!url.trim()) {
      setError('Please paste a public Instagram Reel link.');
      return;
    }

    if (!/^https?:\/\/(www\.)?instagram\.com\//i.test(url.trim())) {
      setError('Please paste a valid Instagram Reel URL.');
      return;
    }

    setIsFetching(true);

    try {
      const data = await fetchJsonWithRetry('/api/ig-download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim() }),
      }, 1);

      setMetaData(data.meta);
      setAvailableVideos(data.availableVideos);
      setSelectedVideoUrl(data.videoUrl);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Network error. Check your connection and try again.');
    } finally {
      setIsFetching(false);
    }
  };

  const handleDownload = async () => {
    if (!selectedVideoUrl) return;
    setIsDownloading(true);

    try {
      const proxyUrl = `/api/force-download?url=${encodeURIComponent(selectedVideoUrl)}&title=${encodeURIComponent(`IG_Reel_${metaData?.author || 'Download'}_${Date.now()}`)}&ext=mp4`;
      window.location.href = proxyUrl;
    } catch {
      setError('Download could not be started. Please try another quality or retry in a moment.');
    } finally {
      window.setTimeout(() => setIsDownloading(false), 1500);
    }
  };

  const formatNumber = (num: number) => {
    if (!num) return 'N/A';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  return (
    <ToolInterfaceShell>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#111]/80 backdrop-blur-xl border border-white/10 p-3 rounded-3xl flex flex-col md:flex-row gap-3 mb-8 shadow-2xl relative"
      >
        <div className="flex-1 flex items-center px-4 py-3 bg-black/60 rounded-2xl border border-white/5 focus-within:border-pink-500/50 transition-colors min-h-[48px]">
          <LinkIcon size={20} className="text-pink-400 mr-3 shrink-0" aria-hidden />
          <label htmlFor="reel-url" className="sr-only">
            Instagram Reel URL
          </label>
          <input
            id="reel-url"
            type="url"
            inputMode="url"
            autoComplete="off"
            placeholder="Paste public Reel link (instagram.com/reel/…)"
            className="bg-transparent border-none outline-none w-full text-white text-base placeholder:text-gray-600 min-h-[44px]"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleFetch()}
          />
        </div>
        <button
          type="button"
          onClick={handleFetch}
          disabled={isFetching || !url.trim()}
          className="bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 hover:opacity-90 text-white disabled:opacity-50 disabled:cursor-not-allowed px-8 py-3 min-h-[48px] rounded-2xl font-bold transition-all flex items-center justify-center gap-2 whitespace-nowrap"
        >
          {isFetching ? (
            <>
              <Loader2 size={20} className="animate-spin" aria-hidden /> Loading…
            </>
          ) : (
            'Load reel'
          )}
        </button>
      </motion.div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6"
            role="alert"
          >
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl flex items-center gap-3">
              <AlertCircle size={20} aria-hidden />
              <p className="font-medium text-sm">{error}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {metaData && selectedVideoUrl && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-[#111]/80 backdrop-blur-md border border-white/10 rounded-3xl p-6 shadow-2xl grid grid-cols-1 md:grid-cols-12 gap-8 items-start"
          >
            <div className="md:col-span-5 w-full aspect-[9/16] bg-black rounded-2xl overflow-hidden border border-white/5">
              <video
                src={selectedVideoUrl}
                poster={metaData.thumbnail || undefined}
                controls
                playsInline
                className="w-full h-full object-cover"
                aria-label="Reel preview"
              />
            </div>

            <div className="md:col-span-7 flex flex-col gap-6">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-tr from-pink-500 to-orange-500 rounded-full flex items-center justify-center">
                  <User size={24} className="text-white" aria-hidden />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Creator</p>
                  <p className="text-lg font-bold">@{metaData.author}</p>
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                <p className="text-sm text-gray-400 mb-2 flex items-center gap-2">
                  <AlignLeft size={16} aria-hidden /> Caption
                </p>
                <p className="text-gray-200 text-sm line-clamp-4">{metaData.caption || 'No caption available.'}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-3">
                  <div className="p-3 bg-pink-500/20 text-pink-500 rounded-xl">
                    <Heart size={20} className="fill-pink-500/30" aria-hidden />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{formatNumber(metaData.likes)}</p>
                    <p className="text-xs text-gray-400 font-medium">Likes</p>
                  </div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-3">
                  <div className="p-3 bg-blue-500/20 text-blue-500 rounded-xl">
                    <Eye size={20} aria-hidden />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{formatNumber(metaData.views)}</p>
                    <p className="text-xs text-gray-400 font-medium">Views</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                {availableVideos.length > 1 && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-400 mb-2 flex items-center gap-2 font-medium">
                      <Settings2 size={16} aria-hidden /> Quality
                    </p>
                    <div className="flex flex-wrap gap-2" role="group" aria-label="Video quality">
                      {availableVideos.map((vid, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setSelectedVideoUrl(vid.url)}
                          className={`px-4 py-2 min-h-[44px] rounded-xl text-sm font-bold transition-all border ${selectedVideoUrl === vid.url ? 'bg-pink-500 text-white border-pink-400' : 'bg-black/50 text-gray-400 border-white/10 hover:border-white/30'}`}
                        >
                          {vid.quality || `Option ${idx + 1}`}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleDownload}
                  disabled={isDownloading}
                  className="w-full bg-white hover:bg-gray-200 text-black disabled:opacity-50 py-4 min-h-[48px] rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                >
                  {isDownloading ? (
                    'Saving file…'
                  ) : (
                    <>
                      <Download size={22} aria-hidden /> Save MP4 to device
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </ToolInterfaceShell>
  );
}
