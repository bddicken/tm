Student: Benjamin Dicken
Paper Title: Massive Arrays of Idle Disks For Storage Archives 
Authors: Colarelli, Grunwald


Main Technical Points:

---- A primary point of discussion in this paper was the caching system used in MAID. In the MAID system, most of the disk drives are used for data storage, but several are reserved for caching commonly accessed files and meta-data. It was hoped that incorporating caching into MAID would provide speedup, but it ended up doing the opposite and actually decreasing performance on data sets with little locality.
---- Another main point of the paper was the method for accessing files in the MAID system. In the paper, the authors weight the pros and cons of building the system with a file-level interface and a block-level interface. Although there are benefits to both, they chose to provide the somewhat simpler block-level interface.
---- The authors spent much of the paper discussing the testing and simulation of the MAID system, and compared it to a typical RAID setup. They showed the power consumption and performance of 9 various configurations of the MAID system. At the systems best tuning settings, they were able to get very similar performance to a regular RAID system while using only 15% percent of the energy, which is a very significant result.Weakness:

---- A weakness of this system is that the caching scheme for MAID only work well on workloads with very high locality. As was shown in the paper, using caching on workloads that have low locality both degrades performance and increases energy usage (compared to using no caching). They need to come up with a better scheme which will allow caching to work well on all types of workloads.