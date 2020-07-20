﻿using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.IO;
using System.Linq;

namespace youtube_dl_viewer.Jobs
{
    [SuppressMessage("ReSharper", "InconsistentlySynchronizedField")]
    public static class JobRegistry
    {
        private static int MaxParallelConvertJobs    => Program.MaxParallelConvertJobs;
        private static int MaxParallelGenPreviewJobs => Program.MaxParallelGenPreviewJobs;
        
        public static readonly object LockConverter = new object();
        private static readonly Stack<ConvertJob> convertJobsQueue = new Stack<ConvertJob>();
        private static readonly List<ConvertJob> convertJobs = new List<ConvertJob>();
        
        public static readonly object LockPreviewGen = new object();
        private static readonly Stack<PreviewGenJob> previewGenJobsQueue = new Stack<PreviewGenJob>();
        private static readonly List<PreviewGenJob> previewGenJobs = new List<PreviewGenJob>();

        public static JobProxy<ConvertJob> GetOrStartConvertJob(string src, string dst)
        {
            lock (LockConverter)
            {
                foreach (var cjob in convertJobs.Where(p => p.Running))
                {
                    if (cjob.Source == src)
                    {
                        Console.Out.WriteLine($"Attach new proxy to Job [{cjob.Name}] ({cjob.ProxyCount + 1} attached proxies)");
                        return JobProxy<ConvertJob>.Create(cjob);
                    }
                }

                var job = new ConvertJob(src, dst);
                
                if (previewGenJobs.Count < MaxParallelGenPreviewJobs)
                {
                    Console.Out.WriteLine($"Start new Job [{job.Name}]");
                    convertJobs.Add(job);
                    job.Start();
                    return JobProxy<ConvertJob>.Create(job);
                }
                else
                {
                    Console.Out.WriteLine($"Enqueue new Job [{job.Name}]");
                    convertJobsQueue.Push(job);
                    return JobProxy<ConvertJob>.Create(job);
                }

            }
        }

        public static JobProxy<PreviewGenJob> GetOrQueuePreviewGenJob(string src, string dst, bool attach = true)
        {
            lock (LockPreviewGen)
            {
                foreach (var cjob in previewGenJobs.Where(p => p.Running))
                {
                    if (cjob.Source == src)
                    {
                        Console.Out.WriteLine($"Attach new proxy to Job [{cjob.Name}] ({cjob.ProxyCount + 1} attached proxies)");
                        return attach ? JobProxy<PreviewGenJob>.Create(cjob) : null;
                    }
                }
                foreach (var cjob in previewGenJobsQueue)
                {
                    if (cjob.Source == src)
                    {
                        Console.Out.WriteLine($"Attach new proxy to Job [{cjob.Name}] ({cjob.ProxyCount + 1} attached proxies)");
                        return attach ? JobProxy<PreviewGenJob>.Create(cjob) : null;
                    }
                }

                var job = new PreviewGenJob(src, dst);

                if (previewGenJobs.Count < MaxParallelGenPreviewJobs)
                {
                    Console.Out.WriteLine($"Start new Job [{job.Name}] (direct)");
                    previewGenJobs.Add(job);
                    job.Start();
                    return attach ? JobProxy<PreviewGenJob>.Create(job) : null;
                }
                else
                {
                    Console.Out.WriteLine($"Enqueue new Job [{job.Name}]");
                    previewGenJobsQueue.Push(job);
                    return attach ? JobProxy<PreviewGenJob>.Create(job) : null;
                }
            }
        }

        public static void UnregisterConvertJob(ConvertJob job) // Only call me in lock(LockConverter)
        {
            convertJobs.Remove(job);

            while (convertJobs.Count < MaxParallelConvertJobs && convertJobsQueue.Any())
            {
                var qjob = convertJobsQueue.Pop();
                Console.Out.WriteLine($"Start new Job [{qjob.Name}] (from queue) ({qjob.ProxyCount} attached proxies)");
                qjob.Start();
                convertJobs.Add(job);
            }
        }
        
        public static void UnregisterGenPreviewJob(PreviewGenJob job) // Only call me in lock(LockPreviewGen)
        {
            previewGenJobs.Remove(job);

            while (previewGenJobs.Count < MaxParallelGenPreviewJobs && previewGenJobsQueue.Any())
            {
                var qjob = previewGenJobsQueue.Pop();
                Console.Out.WriteLine($"Start new Job [{qjob.Name}] (from queue) ({qjob.ProxyCount} attached proxies)");
                qjob.Start();
                previewGenJobs.Add(job);
            }
        }
    }
}