import MemberLayout from '@/components/member/memberLayout';

export default function Layout({ children }: { children: React.ReactNode }) {
  return <MemberLayout>{children}</MemberLayout>;
}