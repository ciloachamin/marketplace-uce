import { Icons } from "./Icons"
const Footer = () => {
  return (
    <footer className=' flex-grow-0'>
      <div className='px-2.5 md:px-20'>
        <div className='border-t border-gray-200'>
            <div className='pt-4'>
              <div className='flex justify-center'>
                <Icons.logo className='h-12 w-auto' />
              </div>
            </div>
            <div>
              <div className='relative flex items-center px-6 py-4 sm:py-4 lg:mt-0'>
                <div className='absolute inset-0 overflow-hidden rounded-lg'>
                  <div
                    aria-hidden='true'
                    className='absolute bg-muted inset-0 bg-gradient-to-br bg-opacity-90'
                  />
                </div>

                <div className='text-center relative mx-auto max-w-sm'>
                  <h2 className='font-semibold text-zinc-800'>
                    Conviértete en vendedor
                  </h2>
                  <p className='mt-2 text-sm text-zinc-600'>
                    Si deseas vender productos de alta calidad,
                    puedes hacerlo en cuestión de minutos.{' '}
                    <a
                      href='/seller-plan'
                      aria-label="Comienza ahora"
                      className='whitespace-nowrap font-medium hover:text-zinc-900'>
                      Comienza ahora &rarr;
                    </a>
                  </p>
                </div>

              </div>
            </div>
        </div>

        <div className='text-center md:text-left'>
          <ul className="flex justify-center my-1 space-x-5">
            <li>
              <a href="https://www.facebook.com/smartuc32" aria-label='facebook' className="text-gray-500 hover:text-gray-900 dark:hover:text-white dark:text-gray-400">
                <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"></path>
                </svg>
              </a>
            </li>
            <li>
              <a href="https://www.tiktok.com/@uceshop" aria-label='tiktok' className="text-gray-500 hover:text-gray-900 dark:hover:text-white dark:text-gray-400">
                <svg fill="currentColor" className="w-9 h-9" viewBox="0 0 512 512" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M412.19,118.66a109.27,109.27,0,0,1-9.45-5.5,132.87,132.87,0,0,1-24.27-20.62c-18.1-20.71-24.86-41.72-27.35-56.43h.1C349.14,23.9,350,16,350.13,16H267.69V334.78c0,4.28,0,8.51-.18,12.69,0,.52-.05,1-.08,1.56,0,.23,0,.47-.05.71,0,.06,0,.12,0,.18a70,70,0,0,1-35.22,55.56,68.8,68.8,0,0,1-34.11,9c-38.41,0-69.54-31.32-69.54-70s31.13-70,69.54-70a68.9,68.9,0,0,1,21.41,3.39l.1-83.94a153.14,153.14,0,0,0-118,34.52,161.79,161.79,0,0,0-35.3,43.53c-3.48,6-16.61,30.11-18.2,69.24-1,22.21,5.67,45.22,8.85,54.73v.2c2,5.6,9.75,24.71,22.38,40.82A167.53,167.53,0,0,0,115,470.66v-.2l.2.2C155.11,497.78,199.36,496,199.36,496c7.66-.31,33.32,0,62.46-13.81,32.32-15.31,50.72-38.12,50.72-38.12a158.46,158.46,0,0,0,27.64-45.93c7.46-19.61,9.95-43.13,9.95-52.53V176.49c1,.6,14.32,9.41,14.32,9.41s19.19,12.3,49.13,20.31c21.48,5.7,50.42,6.9,50.42,6.9V131.27C453.86,132.37,433.27,129.17,412.19,118.66Z" />
                </svg>
              </a>
            </li>
          </ul>
        </div>


        <div className='py-4 md:flex md:items-center md:justify-between'>
          <div className='text-center md:text-left'>
            <p className='text-sm text-muted-foreground'>
              &copy; {new Date().getFullYear()} All Rights
              Reserved
            </p>
          </div>


          <div className='mt-4 flex items-center justify-center md:mt-0'>
            <div className='flex space-x-8'>
              <a
                href='#'
                aria-label="Terms of Service"
                className='text-sm text-muted-foreground hover:text-gray-600'>
                Terms
              </a>
              <a
                href='#'
                aria-label="Privacy Policy"
                className='text-sm text-muted-foreground hover:text-gray-600'>
                Privacy Policy
              </a>
              <a
                href='#'
                aria-label="Cookie Policy"
                className='text-sm text-muted-foreground hover:text-gray-600'>
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
