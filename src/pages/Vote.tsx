import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Vote as VoteIcon, CheckCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useWallet } from '../contexts/WalletContext';
import { VotingContractService, Election, Candidate } from '../lib/contract';
import toast from 'react-hot-toast';

const Vote = () => {
  const { user, supabase } = useAuth();
  const { account } = useWallet();
  const navigate = useNavigate();
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null);
  const [election, setElection] = useState<Election | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);

  const checkVotingStatus = async (electionId: string) => {
    if (!account) return false;
    try {
      const votingService = new VotingContractService();
      const voted = await votingService.hasUserVoted(electionId, account);
      setHasVoted(voted);
      return voted;
    } catch (error) {
      console.error('Error checking voting status:', error);
      return false;
    }
  };

  useEffect(() => {
    const fetchElectionData = async () => {
      try {
        const { data: elections, error: electionError } = await supabase
          .from('elections')
          .select('*')
          .eq('status', 'active')
          .limit(1)
          .maybeSingle();

        if (electionError) throw electionError;
        setElection(elections);

        if (elections) {
          const { data: candidates, error: candidatesError } = await supabase
            .from('candidates')
            .select('*')
            .eq('election_id', elections.id);

          if (candidatesError) throw candidatesError;
          setCandidates(candidates || []);

          if (account) {
            const voted = await checkVotingStatus(elections.id);
            if (voted) {
              toast.error('You have already voted in this election');
            }
          }
        } else {
          setCandidates([]);
        }
      } catch (error) {
        console.error('Error fetching election data:', error);
        toast.error('Failed to load election data');
      } finally {
        setLoading(false);
      }
    };

    if (user?.email_confirmed_at) {
      fetchElectionData();
    }
  }, [supabase, user, account]);

  // Re-check voting status when account changes
  useEffect(() => {
    if (account && election) {
      checkVotingStatus(election.id);
    }
  }, [account, election]);

  const handleVote = async () => {
    if (!selectedCandidate || !election || !account) return;
    
    try {
      // Check voting status again before proceeding
      const hasAlreadyVoted = await checkVotingStatus(election.id);
      if (hasAlreadyVoted) {
        toast.error('You have already voted in this election');
        setHasVoted(true);
        return;
      }

      setVoting(true);
      const votingService = new VotingContractService();
      toast.loading('Please confirm the transaction in MetaMask...', { id: 'vote-pending' });
      
      const tx = await votingService.castVote(election.id, selectedCandidate);
      toast.loading('Transaction submitted, waiting for confirmation...', { id: 'vote-pending' });
      
      await tx.wait();
      
      // Update voting status after successful vote
      setHasVoted(true);
      toast.success('Vote cast successfully!', { id: 'vote-pending' });
      navigate('/thank-you');
    } catch (error: any) {
      console.error('Error casting vote:', error);
      if (error.message.includes('Already voted')) {
        setHasVoted(true);
        toast.error('You have already voted in this election', { id: 'vote-pending' });
      } else {
        toast.error('Failed to cast vote. Please try again.', { id: 'vote-pending' });
      }
    } finally {
      setVoting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!election) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">No Active Election</h2>
          <p className="mt-2 text-gray-600">There are no active elections at the moment.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-cover bg-center" style={{ backgroundImage: `url('https://dktmdipdmljrgorzzlgl.supabase.co/storage/v1/object/sign/img/istockphoto-173932687-612x612.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJpbWcvaXN0b2NrcGhvdG8tMTczOTMyNjg3LTYxMng2MTIuanBnIiwiaWF0IjoxNzQzNjU5MDA4LCJleHAiOjE4MzAwNTkwMDh9.lR7e79FPIzNC9rMoxZ6lP8W1VMLISg23AtEB-RaMeTs')` }}>
      <div className="max-w-lg w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div className="mx-auto flex justify-center">
          <VoteIcon className="h-12 w-12 text-indigo-600" />
        </div>
        <h2 className="text-center text-3xl font-extrabold text-gray-900">{election.title}</h2>
        <p className="text-center text-sm text-gray-600">{election.description}</p>
        {hasVoted && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-center text-sm text-red-600 font-medium">
              You have already voted in this election
            </p>
          </div>
        )}
        <div className="space-y-4">
          {candidates.map((candidate) => (
            <button
              key={candidate.id}
              onClick={() => !hasVoted && setSelectedCandidate(candidate.id)}
              disabled={hasVoted}
              className={`w-full p-4 rounded-lg border-2 transition-colors ${
                selectedCandidate === candidate.id 
                  ? 'border-indigo-600 bg-indigo-50' 
                  : hasVoted 
                    ? 'border-gray-200 opacity-60 cursor-not-allowed' 
                    : 'border-gray-200 hover:border-indigo-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="text-left">
                  <h3 className="text-lg font-medium text-gray-900">{candidate.name}</h3>
                  <p className="text-sm text-gray-500">{candidate.party}</p>
                </div>
                {selectedCandidate === candidate.id && <CheckCircle className="h-6 w-6 text-indigo-600" />}
              </div>
            </button>
          ))}
        </div>
        <button
          onClick={handleVote}
          disabled={!selectedCandidate || voting || hasVoted}
          className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
            selectedCandidate && !voting && !hasVoted 
              ? 'bg-indigo-600 hover:bg-indigo-700' 
              : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          {voting ? (
            <><Loader2 className="h-5 w-5 animate-spin mr-2" />Casting Vote...</>
          ) : hasVoted ? (
            'Already Voted'
          ) : (
            'Submit Vote'
          )}
        </button>
      </div>
    </div>
  );
};

export default Vote;