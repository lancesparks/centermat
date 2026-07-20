"use client";

import Image from "next/image";
import { User } from "../../types/user.type";
import { useCurrentUser } from "../../hooks/useCurrentUser";

interface HeaderProps {
  user: User;
}

export default function Header() {
  const { data: user, isLoading, isError } = useCurrentUser();

  console.log(user, isLoading, isError);

  // if (isLoading) return <p>Loading user...</p>;
  // if (isError || !user) return <p>Not signed in</p>;

  // return <div>Welcome, {user.first_name}!</div>;

  return (
    <div className="cm-rule-b py-2 px-1">
      <div className="flex justify-left">
        <Image
          src="/centermat-logo-transparent.png"
          alt="Centermat"
          width={190}
          height={69}
          priority
        />
      </div>
    </div>
  );
}
