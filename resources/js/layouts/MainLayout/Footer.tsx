import { footerData } from "@/routes/footer";

export default function Footer() {
  return (
    <footer className="w-full pt-20 pb-10 px-8 bg-surface-dim border-t border-white/5">
      <div className="max-w-screen-2xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-20">
          <div className="md:col-span-6 space-y-6">
            <div className="flex items-center gap-2">
              <img src="/images/logo/logo.png" alt="logo" className='w-10 h-10' />
              <div className="font-headline font-bold text-2xl tracking-tight">
                <span className='text-primary-light'>Fade</span>
                <span className="text-primary">Ball</span>
              </div>
            </div>
            <p className="text-white/40 text-sm leading-relaxed max-w-xs font-body">
              {footerData.description}
            </p>
            <div className="flex items-center gap-4">
              {footerData.social.map((social) => (
                <a key={social.title} href={social.path} className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-primary hover:border-primary/50 transition-all">
                  <i className={`fab ${social.icon} text-sm`}></i>
                </a>
              ))}
            </div>
          </div>
          {footerData.links.map((link) => (
            <div className="md:col-span-2 space-y-6">
              <h4 className="text-white text-xs font-label uppercase tracking-widest font-bold">{link.title}</h4>
              <ul className="space-y-4 text-sm text-white/40 font-medium">
                {link.links.map((l) => (
                  <li key={l.title}><a href={l.path} className="hover:text-primary transition-colors">{l.title}</a></li>
                ))}
              </ul>
            </div>
          ))}

        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-[10px] uppercase tracking-widest text-white/20 font-bold">
            {footerData.copyright}
          </div>
          <div className="flex gap-8 text-[10px] uppercase tracking-widest text-white/20 font-bold">
            {footerData.legal.map((l) => (
              <a key={l.title} href={l.path} className="hover:text-white transition-colors">{l.title}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
