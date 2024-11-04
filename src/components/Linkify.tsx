import Link from "next/link";
import React from "react";
import { LinkIt, LinkItUrl } from "react-linkify-it";

interface LinkifyProps {
  children: React.ReactNode;
}

const Linkify = ({ children }: LinkifyProps) => {
  return (
    <LinkifyUsername>
      <LinkifyHashtags>
        <LinkifyUrl>{children}</LinkifyUrl>
      </LinkifyHashtags>
    </LinkifyUsername>
  );
};

function LinkifyUrl({ children }: LinkifyProps) {
  return (
    <LinkItUrl className="text-primary hover:underline">{children}</LinkItUrl>
  );
}

function LinkifyUsername({ children }: LinkifyProps) {
  return (
    <LinkIt
      regex={/@[a-zA-Z0-9_-]+/}
      component={(match, key) => {
        const username = match.slice(1);
        return (
          <Link
            href={`/users/${username}`}
            className="text-primary hover:underline"
            key={key}
          >
            {match}
          </Link>
        );
      }}
    >
      {children}
    </LinkIt>
  );
}

function LinkifyHashtags({ children }: LinkifyProps) {
  return (
    <LinkIt
      regex={/#[a-zA-Z0-9_-]+/}
      component={(match, key) => {
        const hashtag = match.slice(1);
        return (
          <Link
            key={key}
            // href={`/hashtag/${hashtag}`}
            href={`/`}
            className="text-primary hover:underline"
          >
            {match}
          </Link>
        );
      }}
    >
      {children}
    </LinkIt>
  );
}
export default Linkify;
