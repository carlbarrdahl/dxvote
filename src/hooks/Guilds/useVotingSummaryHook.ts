import { useEffect, useState } from 'react';
import { useProposal } from 'hooks/Guilds/ether-swr/useProposal';
import { useTotalLocked } from './ether-swr/useTotalLocked';

export default function useVotingSummaryHook(
  guildId: string,
  proposalId: string
) {
  const [votes, setVotes] = useState([]);
  const { data: proposal } = useProposal(guildId, proposalId);
  const { data: totalLocked } = useTotalLocked({
    contractAddress: guildId,
  });

  useEffect(() => {
    if (proposal) {
      const newVotes = [];
      const totalVotes = proposal.totalVotes;
      totalVotes.forEach((votes, index) => {
        if (votes.gt(0)) {
          newVotes.push(totalLocked.div(votes));
        } else {
          newVotes.push(votes);
        }
      });
      setVotes(newVotes);
    }
  }, [proposal, totalLocked]);
  console.log({ votes });
  return {
    votes: votes,
  };
}
