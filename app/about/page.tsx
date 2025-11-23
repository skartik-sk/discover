import Link from 'next/link';

export default function AboutPage() {
  return (
        <main className="flex w-full grow flex-col">
          <section className="relative w-full h-[50vh] md:h-[60vh] flex items-center justify-center text-center p-6 md:p-8">
            <div className="absolute inset-0 bg-cover bg-center" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDzLtPhmNYW6AWzDHq6KyJmrlZT7k9mTzb269hItNj2-Dc4dFciw-88byjU8-YDzIkksG78riCAl6yPDR5MlPpYUHYJ3v8nTCsFeevijtjmUO8hUxooL4SOHhzspuGMmj2dNZbWb8JlHd6SGevBq1bNKdUap57Smjlph6Pv9wiIiy_3c5gmK09k4_ZgaklY959bKNqIbGVb8u3UT0b6Y6DFdvFoChb4ByNhG6VSv0GReM7CsoiWdVyJxfQc7hrJFhji4Uz9uOM0Fiyq")', filter: 'saturate(0.5) contrast(0.9) brightness(0.9)'}}></div>
            <div className="absolute inset-0 bg-linear-to-t from-main-bg/30 via-main-bg/10 to-transparent"></div>
            <div className="relative z-10">
              <h1 className="text-header-text text-4xl font-bold leading-tight tracking-tight md:text-6xl">Empowering Web3 Discovery</h1>
              <p className="mt-4 max-w-2xl mx-auto text-header-text/80 text-base font-normal leading-relaxed md:text-lg">Discover is more than a platform; it&apos;s a community-driven ecosystem designed to illuminate the future of the decentralized web.</p>
            </div>
          </section>
          <div className="px-6 py-12 md:px-16 md:py-24 space-y-20 md:space-y-32 max-w-5xl mx-auto">
            <section className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-4">
                <h2 className="text-3xl md:text-4xl font-bold text-header-text tracking-tight">Our Mission</h2>
                <p className="text-body-text leading-relaxed">Our mission is to democratize access to the burgeoning Web3 landscape. We provide a curated, transparent, and user-friendly platform where innovators can showcase their projects and users can explore, learn, and engage with the technologies shaping our digital future. We believe in the power of community to surface the most promising and impactful projects in the decentralized world.</p>
                <ul className="space-y-3 pt-4">
                  <li className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-xl! text-accent-blue mt-1">verified</span>
                    <span className="flex-1"><strong>Curate Quality:</strong> To meticulously vet and showcase high-potential Web3 projects.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-xl! text-accent-blue mt-1">groups</span>
                    <span className="flex-1"><strong>Foster Community:</strong> To build a vibrant network of builders, investors, and enthusiasts.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-xl! text-accent-blue mt-1">school</span>
                    <span className="flex-1"><strong>Educate &amp; Empower:</strong> To demystify Web3 and provide resources for all levels of expertise.</span>
                  </li>
                </ul>
              </div>
              <div>
                <img alt="Abstract image representing community and innovation" className="rounded-soft w-full h-auto object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC9AawDW9tRN8nZQsBrSCvl7N9G5hCL4fSKh-hRq3LTu6b303qbPo5gT3H3ibq6nPbtSun0chmZxpvjfe6wRI6d8HcHaoN6vzDcgyCfDOOIrVvUTohLNKXKM4Kt_4nSoFNjXfS-iezhayD5YLMTa7NYUOqiRLXNb3fXpQcYKQVjEd_u3oUo0bVKQzoQQXKGgrxtMYo08AwOPjL2O34sCz_ptwFvfUjuDSHtab3QMlOhQLiN-i8aS1E2Vu3engcQQlUVH5_qV2YxqL2J" style={{filter: 'saturate(0.8)'}}/>
              </div>
            </section>
            <section className="bg-white/50 rounded-soft p-8 md:p-12 shadow-card">
              <div className="text-center max-w-2xl mx-auto mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-header-text tracking-tight">How Web3 Verification Works</h2>
                <p className="mt-4 text-body-text leading-relaxed">We employ a multi-layered approach to ensure the projects on Discover are legitimate and transparent, combining automated checks with community validation.</p>
              </div>
              <div className="grid md:grid-cols-3 gap-8 text-center">
                <div className="flex flex-col items-center">
                  <div className="flex items-center justify-center size-16 rounded-full bg-accent-blue/10 text-accent-blue mb-4">
                    <span className="material-symbols-outlined text-3xl!">smart_toy</span>
                  </div>
                  <h3 className="font-bold text-header-text text-lg mb-2">1. Smart Contract Analysis</h3>
                  <p className="text-sm text-body-text">Automated tools scan project smart contracts for common vulnerabilities and adherence to best practices.</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="flex items-center justify-center size-16 rounded-full bg-accent-terracotta/10 text-accent-terracotta mb-4">
                    <span className="material-symbols-outlined text-3xl!">how_to_vote</span>
                  </div>
                  <h3 className="font-bold text-header-text text-lg mb-2">2. Community Due Diligence</h3>
                  <p className="text-sm text-body-text">Our community of experts review and vote on project authenticity, utility, and team credibility.</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="flex items-center justify-center size-16 rounded-full bg-accent-yellow/20 text-accent-yellow mb-4">
                    <span className="material-symbols-outlined text-3xl!">shield</span>
                  </div>
                  <h3 className="font-bold text-header-text text-lg mb-2">3. Verified Badge</h3>
                  <p className="text-sm text-body-text">Projects that pass our rigorous checks receive a 'Verified' badge, signaling trust and transparency.</p>
                </div>
              </div>
            </section>
            <section>
              <div className="text-center max-w-2xl mx-auto mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-header-text tracking-tight">Meet the Core Contributors</h2>
                <p className="mt-4 text-body-text leading-relaxed">We're a distributed team of developers, designers, and strategists passionate about building a better, more open internet.</p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                <div className="text-center">
                  <img alt="Team member photo" className="w-24 h-24 md:w-32 md:h-32 rounded-full mx-auto object-cover mb-4 shadow-md" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBOyflq0lOLqIHIj6DrKczMsyuyYIUM0Uk0XQY-RhLq83I2_wvndiUuwt6lV2KU2ZnT2RW1y9l7onf_HQ-GclqbPDp2oZ21YDK9aOcOzsBcqK-xLYgYCnSwq5iald_r55NHTu0sRYj-SQnWB0lEIPG-aGCJORcReK2XuVO47pBF3p0BLhce3AnT9pcR8V_PckCcpfIrQs73svF5r8oRs4pv_aKetgxjE7kFzcleSvsDZTXugeN7DZAJD9q9N0dD7l7mX8jrTgzcZZJy"/>
                  <h3 className="font-bold text-header-text">Alex Chen</h3>
                  <p className="text-sm text-body-text">Lead Protocol Engineer</p>
                </div>
                <div className="text-center">
                  <img alt="Team member photo" className="w-24 h-24 md:w-32 md:h-32 rounded-full mx-auto object-cover mb-4 shadow-md" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDn3UWp_fd3KajrkhM-jyWaQbCZZPPnB1Qk7RbFCtAtQAQe48BhsYqKrF7GR3HO81Esk-KvujjuZMYBBf2BWIrMk8dBWYYTbnBYZ2l8PKgdP6VmAwk9aqneajzfdMIOAWOo0mXT0h7Shf97ijtLdpaYEQBGnr9On9T7puB_LPINq19vzIbO0ymmk2Np9nbpP5b9M-YdMoA-eKqhgaokXdgLjf8Zvehkw-gmpCmU5vUrN8zP--xNRWr2qQ2EpHtUAYJQyYnQV4Lp47hm"/>
                  <h3 className="font-bold text-header-text">Ben Carter</h3>
                  <p className="text-sm text-body-text">Product &amp; Design Lead</p>
                </div>
                <div className="text-center">
                  <img alt="Team member photo" className="w-24 h-24 md:w-32 md:h-32 rounded-full mx-auto object-cover mb-4 shadow-md" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDa1Q5ZoqBsLBXWaYnaV0Bs4sO7YJpMfRcC7i-JAkYGXYUoWsul8w6JelZdJcXX7VfvKsHmp-MeCu95BROodXGqYUY4yH4Ki_MUovpRu70PHMWlj0KK3iM0nwOXVq1V16CbBblyUpIb38ZiOrfIlLANoShydL5Y3uJcSq8_HKsZoyDAWCewO3cRMYuN5A05y1uRRQcaJhhgQO0scCr3uyHeaU_L4T47hcetGZ2qoSmGwrZB0pjDwGV_HwApoPj0vGmP86eY1AOmn5vD"/>
                  <h3 className="font-bold text-header-text">Chloe Davis</h3>
                  <p className="text-sm text-body-text">Community &amp; Growth</p>
                </div>
                <div className="text-center">
                  <img alt="Team member photo" className="w-24 h-24 md:w-32 md:h-32 rounded-full mx-auto object-cover mb-4 shadow-md" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDKG7qUGGFBD-uG1YeMOKZEhSJZoy9CVoXM3g8DLDHWr4PVDapr-erblPKI0mJFxPv6gEUPmAZALlSXSMAQGfPgV2EbY78pb3HE_ReNa7AsmOaLkzydBbWixhgZaNt_-6w7oKLtgJRktZE5ppQNvbYbZ3wQBcQ_EOvH9bxZDF91nnX1nEnWDgL9pSPRt19_u1wNw3_mixSC4_fNizC5jdLBTCen-r42qTHmNJqYvZ29Z7wXmmQMppGWWsOD-9A0VwjrQbUwvEn9Xcjk"/>
                  <h3 className="font-bold text-header-text">Dana Rodriguez</h3>
                  <p className="text-sm text-body-text">Operations</p>
                </div>
              </div>
            </section>
            <section className="text-center py-12">
              <h2 className="text-3xl md:text-4xl font-bold text-header-text tracking-tight">Ready to Shape the Future?</h2>
              <p className="mt-4 max-w-xl mx-auto text-body-text leading-relaxed">Join our Discord, follow us on socials, and start exploring the projects that are building tomorrow, today.</p>
              <button className="mt-8 flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-btn h-12 px-8 bg-primary-green text-white text-base font-semibold transition-transform duration-200 ease-in-out hover:scale-105 mx-auto">
                <span className="truncate">Join the Community</span>
              </button>
            </section>
          </div>
        </main>
  );
}
