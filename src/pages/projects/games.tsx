import { Layout } from "~/components/layout";
import { Link } from "~/components/link";
import gamesImage from "~/images/project_images/games.gif";
import { projects } from "~/lib/projects";
import ShowProjectPage from "./[project_id]";

const games = projects.filter((p) => p.isGame);

const GamesPageInner = () => {
  return (
    <ShowProjectPage
      project={{
        id: "games",
        title: "Games!",
        image: gamesImage.src,
        hideImage: true,
        desc: [
          <p key="_">
            Some of the games I&rsquo;ve made for clients or for learning!
            <br />
            <br />
          </p>,

          ...games.map((game) => (
            <p key={game.id}>
              🎮 &nbsp;
              {game.url ? (
                <a href={game.url}>{game.title}</a>
              ) : (
                <Link href={`/projects/${game.id}`}>{game.title}</Link>
              )}
              {game.desc && typeof game.desc === "string"
                ? `: ${game.desc}`
                : Array.isArray(game.desc)
                  ? game.desc
                  : null}
            </p>
          )),
        ],
      }}
    />
  );
};

export default function GamesPage() {
  return (
    <Layout pageClassName="content">
      <GamesPageInner />
    </Layout>
  );
}
