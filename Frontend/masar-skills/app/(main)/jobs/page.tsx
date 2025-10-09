import { verifyAuthAction } from '@/actions/auth-actions'
import { redirect } from 'next/navigation'
import JobsPage from '@/components/jobs/JobsPage';


export default async function page() {
  const result = await verifyAuthAction();
    if(!result.user){
      return redirect('/');
    }
  return(
    <JobsPage/>
  );
}