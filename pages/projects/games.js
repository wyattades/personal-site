import Link from 'components/Link';
import projects from 'lib/projects';
import gamesImage from 'images/project_images/games.gif';

import ShowProjectPage from './[project_id]';

const games = projects.filter((p) => p.isGame);

const GamesPage = () => {
  return (
    <ShowProjectPage
      project={{
        id: 'games',
        title: 'Games!',
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
              {game.desc && `: ${game.desc}`}
            </p>
          )),
        ],
      }}
    />
  );
};

GamesPage.getLayout = ShowProjectPage.getLayout;

export default GamesPage;
