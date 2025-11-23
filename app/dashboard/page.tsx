import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

async function getDashboardData() {
  // Get the first user (demo - replace with auth later)
  const user = await prisma.user.findFirst({
    include: {
      projects: {
        orderBy: { createdAt: 'desc' },
        take: 5,
      },
      _count: {
        select: {
          projects: true,
          reviews: true,
          likes: true,
        },
      },
    },
  });
  
  return user;
}

export default async function DashboardPage() {
  const user = await getDashboardData();
  return (
    <div className="relative flex min-h-screen w-full flex-col">
      <div className="layout-container flex h-full grow flex-col">
        <div className="px-4 sm:px-8 md:px-16 lg:px-24 xl:px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col w-full max-w-6xl flex-1">
            <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-light-grey/80 px-6 sm:px-10 py-4 bg-soft-cream/80 backdrop-blur-sm sticky top-4 z-10 rounded-xl">
              <div className="flex items-center gap-4 text-forest-green">
                <div className="size-6">
                  <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                    <path clipRule="evenodd" d="M24 18.4228L42 11.475V34.3663C42 34.7796 41.7457 35.1504 41.3601 35.2992L24 42V18.4228Z" fill="currentColor" fillRule="evenodd"></path>
                    <path clipRule="evenodd" d="M24 8.18819L33.4123 11.574L24 15.2071L14.5877 11.574L24 8.18819ZM9 15.8487L21 20.4805V37.6263L9 32.9945V15.8487ZM27 37.6263V20.4805L39 15.8487V32.9945L27 37.6263ZM25.354 2.29885C24.4788 1.98402 23.5212 1.98402 22.646 2.29885L4.98454 8.65208C3.7939 9.08038 3 10.2097 3 11.475V34.3663C3 36.0196 4.01719 37.5026 5.55962 38.098L22.9197 44.7987C23.6149 45.0671 24.3851 45.0671 25.0803 44.7987L42.4404 38.098C43.9828 37.5026 45 36.0196 45 34.3663V11.475C45 10.2097 44.2061 9.08038 43.0155 8.65208L25.354 2.29885Z" fill="currentColor" fillRule="evenodd"></path>
                  </svg>
                </div>
                <h2 className="text-forest-green text-xl font-bold leading-tight tracking-[-0.015em]">Discover</h2>
              </div>
              <div className="hidden md:flex items-center gap-9">
                <Link className="text-dark-grey text-sm font-medium leading-normal hover:text-forest-green transition-colors" href="/">Home</Link>
                <Link className="text-dark-grey text-sm font-medium leading-normal hover:text-forest-green transition-colors" href="/projects">Explore</Link>
                <Link className="text-dark-grey text-sm font-medium leading-normal hover:text-forest-green transition-colors" href="/projects">Projects</Link>
              </div>
              <div className="flex items-center gap-4">
                <button className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 w-10 bg-white/50 hover:bg-white text-dark-grey transition-colors">
                  <span className="material-symbols-outlined">notifications</span>
                </button>
                <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10" data-alt="User's abstract 3D avatar" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDoHHlA9pMN6Nh6l9sseluDtdK-0ocxgr1IJ1-U51_FNGEGs8LBPxc1zr8CLYcspwJvt8rO_cHbv-ftxPeaCgFz19L2K1BeFo1T6XP9xv3hys9_bT0zOSvUWcqcLNCjQvilJYweoMAcvG2CICZ9jWxpecKOgxarnwU9yriUnW_Mc_bdFc6D8xxLwNV8dnYRvpvfkM41Q_E2zI1rTcvWKuzgFzc9r5KjQWU5-LTso18jr-Jr-pIpykGvZq-b6ptTii4yt5antLOIHGF4")'}}></div>
              </div>
            </header>
            <main className="flex-1 mt-8">
              <div className="flex flex-wrap justify-between gap-4 px-4 sm:px-6 mb-8">
                <p className="text-dark-grey text-4xl sm:text-5xl font-black leading-tight tracking-[-0.033em] min-w-72">My Dashboard</p>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4">
                {/* Identity Card */}
                {user && (
                  <div className="lg:col-span-1 xl:col-span-1 lg:row-span-2 flex flex-col items-stretch justify-start rounded-xl bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
                    <div 
                      className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-lg mb-6" 
                      data-alt="User avatar" 
                      style={{backgroundImage: `url("${user.image || 'https://lh3.googleusercontent.com/aida-public/AB6AXuC3LwVONpV-RKqmNRF1RHjGG-3gpbAuSWf0Mr02JNOAYlKCamWDcTQuArgp1pgQAB1e7SrySjZMh2q44kwcTD3pDQeCjqOxwOKgAPudFTOyhUb__xVQYfmDbqRVUWTS2uRI-rEg_whKH99UAwWrRPbHaSfpahMlxgknCd9-wpSWYzkVgEi9iUUw7nLtqVTlZt78ubX0G4Ttn21X-2CHmeX4eNY77TSGbhm-bHbzR2UNV8Q3VUFVN1jyv8kKtPj7lWbClc00fKeEIMpr'}")`}}
                    ></div>
                    <p className="text-dark-grey text-2xl font-bold leading-tight tracking-[-0.015em] mb-2">{user.name || user.walletAddress || 'builder.eth'}</p>
                    <div className="flex items-center gap-4">
                      <div className="relative size-20">
                        <svg className="size-full" height="36" viewBox="0 0 36 36" width="36" xmlns="http://www.w3.org/2000/svg">
                          <circle className="stroke-light-grey" cx="18" cy="18" fill="none" r="16" strokeWidth="3"></circle>
                          <circle className="stroke-forest-green" cx="18" cy="18" fill="none" r="16" strokeDasharray={`${user.trustScore / 10} ${100 - user.trustScore / 10}`} strokeDashoffset="25" strokeWidth="3" transform="rotate(-90 18 18)"></circle>
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-lg font-bold text-forest-green">{user.trustScore}</span>
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <p className="text-dark-grey text-base font-bold leading-normal">Trust Score</p>
                        <p className="text-medium-grey text-sm font-normal leading-normal">/ 1000</p>
                      </div>
                    </div>
                  </div>
                )}
                {/* Badge Showcase */}
                <div className="lg:col-span-2 xl:col-span-3 lg:row-span-3 rounded-xl bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
                  <h3 className="text-xl font-bold mb-4">Badge Showcase</h3>
                  <div className="grid grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-4">
                    <div className="flex flex-col items-center p-4 rounded-lg bg-soft-cream/60 ring-1 ring-inset ring-light-grey/50">
                      <img className="w-20 h-20 mb-2 transition-transform hover:scale-105" data-alt="Early Adopter Badge - a green laurel wreath" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD_hqKkq8ZyCAK7-_lclZqhmLr6kpxtB0k9g4U2ba3OvPHllaiG8ojrGyNTrEHXcDTn9gbFPZ_aTsJkPbuOfFy5TUnXz6Fd-Gy5MZbYbHh9szm6ZV5gc-ExOZ319hNWqsKDat9kAB6QziUnA6YQtwkBC6n00koPuwDAh5XZYxSog7BmQGqkPt4i_SWqAxYMCvk7tOTSGf_FL-QxEYaLjvE6xbXxDg9dCEa02oj_71k33SvYmIeZqc31ITgFLZiUpup-vors0DEBF5qg"/>
                      <p className="text-dark-grey text-center text-sm font-bold leading-tight">Early Adopter</p>
                    </div>
                    <div className="flex flex-col items-center p-4 rounded-lg bg-soft-cream/60 ring-1 ring-inset ring-light-grey/50">
                      <img className="w-20 h-20 mb-2 transition-transform hover:scale-105" data-alt="Protocol Expert Badge - a pink brain icon" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDF-3BHekJ08yIlHd_QWS0OOeyi1ymTwOzQUFWlXTFiUwJgSVjuHipyVme_Do2ink4hdDB5yfaoq1qVkGw_vuKEVD-eUrcv6C33UhcaEjatdvRUCHpf9FfLus-15bQCwv7Wd42Ia5n9T4-qfA5cCZK6GlSMt6YuAEV2JE57T69Qda3wR4n6BLZ4LzchkhfQb6QKt55cJlYcDULA4U7w9rgD1wz_FXYI4L6ycjSJ73SAIMCLi3eH89R9qa6ynYw8JRQnsNj2VmRvtn_2"/>
                      <p className="text-dark-grey text-center text-sm font-bold leading-tight">Protocol Expert</p>
                    </div>
                    <div className="flex flex-col items-center p-4 rounded-lg bg-soft-cream/60 ring-1 ring-inset ring-light-grey/50">
                      <img className="w-20 h-20 mb-2 transition-transform hover:scale-105" data-alt="Top Contributor Badge - a gold medal icon" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCOsMubnvP2JLMjjBwBpooYnvObg5LPeiHr3HPkcRVwsR-goanGCcnh-gpLWUdr3ekJHWf2cJVrWyuqOOEHgx25qPMmvduIzwH_dudFEScsEpfITpT6sM-d78NKxOVb9Kg-h-ObN0pMyfF2OpsZ0XdCmhWJuOUnuK7XpZ1mYt2e_5sqpt_-mF6LF-9zSXs5JaA7ZHg_5WLlEW_NfcF-8-VQvBEPWWdOt1j1KG3kzvVTS7kmPbkadc2qlqrnHa3gb82U-P5XlcAVD_LU"/>
                      <p className="text-dark-grey text-center text-sm font-bold leading-tight">Top Contributor</p>
                    </div>
                    <div className="flex flex-col items-center p-4 rounded-lg bg-gray-100 opacity-60">
                      <img className="w-20 h-20 mb-2 filter grayscale" data-alt="Community Leader Badge - icon of three people" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAmhicQ-VEzPU5f09vfHop-znNgyjjVxXphOFrMySKw_2xmtlnS829prRZKYP6mhw9E1XMseb7M9BRaKHb_OiZ3M3OXST0be3IDyIMKHvGZve5FdNW9XTURlzkwZwX0IhwdSH6zcJA_VsyPhH5VsXOkOEuy6anzdszEv-Muz0-UBVtp1mP5EqNK8oj7JGYskoeYrzYVP6PXhvJIRAwR-k-JQB0yNXl4DlJ31yVjPGPwln0vOT90qd7ecJNpwmEBD7BUSGySk41Dkvw2"/>
                      <p className="text-medium-grey text-center text-sm font-bold leading-tight">Community Leader <span className="text-xs font-normal block">(Locked)</span></p>
                    </div>
                    <div className="flex flex-col items-center p-4 rounded-lg bg-gray-100 opacity-60">
                      <img className="w-20 h-20 mb-2 filter grayscale" data-alt="DAO Voter Badge - an icon of a ballot box" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAxTES0gfXREUy560Md1lFQCuphal12HPMhtUbz14pKu4YCrxTMbjpmptcvSClKCeiQqgzJQza4AKAmkzpg6G5rmdHGN2upqwteW7nyQOv-2qlKvjv23VTY3FP0TkBTLWi-35ovmAJTt8jYNg-yIAnVVyRRX1w2rsVdaxKpNAkZqCJVyLIHCo0avWJ_6rh_vEJs-C3FumiVHK_thJf8G9KanJxiE3WmivVcTxpEks6TX6LIr0hUA9GsFAQY3SAce8Bia_cYJC6tmWKC"/>
                      <p className="text-medium-grey text-center text-sm font-bold leading-tight">DAO Voter <span className="text-xs font-normal block">(Locked)</span></p>
                    </div>
                    <div className="flex flex-col items-center p-4 rounded-lg bg-gray-100 opacity-60">
                      <img className="w-20 h-20 mb-2 filter grayscale" data-alt="Sybil Resistant Badge - a shield icon" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB9_AYFRy1mS4dwII0rufsiFV-p1eHksfJiVgHxGdnCH13N1A0vQwJYET0KqG8vq-fSVhRKHU1_WKH6G2YbTHULnFZxk1Ozqr0VFrKAH-NwkVMG5kQk8twRnj5KMBsp210gqgIttZzo2_vZe7phAorZZ8eCciZY2IlonBA9PfScynx8VMsqlsg8PVYARQvjDAFxoIYETpYChVRZJ3mTKtIOFkhCJ-_L4RjrevhGiiPxCZhLjy7dTL20iVQVUsoJE_jCevYmp6fj7E-H"/>
                      <p className="text-medium-grey text-center text-sm font-bold leading-tight">Sybil Resistant <span className="text-xs font-normal block">(Locked)</span></p>
                    </div>
                  </div>
                </div>
                {/* Recent Activity */}
                <div className="lg:col-span-1 xl:col-span-1 lg:row-span-2 rounded-xl bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
                  <h3 className="text-xl font-bold mb-4">Recent Activity</h3>
                  <ul className="space-y-4">
                    {user && user.projects.length > 0 ? (
                      user.projects.map((project) => (
                        <li key={project.id} className="flex items-start gap-4">
                          <div className="shrink-0 size-8 bg-azure-blue/10 rounded-full flex items-center justify-center">
                            <span className="material-symbols-outlined text-azure-blue text-base">add_circle</span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-dark-grey">
                              Submitted project: <Link href={`/project/${project.slug}`} className="font-bold hover:underline">{project.name}</Link>
                            </p>
                            <p className="text-xs text-medium-grey">{new Date(project.createdAt).toLocaleDateString()}</p>
                          </div>
                        </li>
                      ))
                    ) : (
                      <li className="text-sm text-medium-grey">No recent activity</li>
                    )}
                  </ul>
                </div>
                {/* Rewards Progress */}
                <div className="lg:col-span-3 xl:col-span-4 rounded-xl bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
                  <div className="flex flex-col gap-3">
                    <div className="flex gap-6 justify-between items-center">
                      <p className="text-dark-grey text-base font-bold leading-normal">Next Level: Innovator</p>
                      <p className="text-azure-blue text-sm font-bold leading-normal">60%</p>
                    </div>
                    <div className="rounded-full bg-light-grey/50 h-3 overflow-hidden">
                      <div className="h-3 rounded-full bg-azure-blue" style={{width: '60%'}}></div>
                    </div>
                    <p className="text-medium-grey text-sm font-normal leading-normal">250 XP to next reward</p>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
