// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract VotingContract {
    struct Vote {
        address voter;
        bytes32 electionId;
        bytes32 candidateId;
        uint256 timestamp;
    }

    mapping(bytes32 => mapping(address => bool)) public hasVoted;
    mapping(bytes32 => uint256) public votesCount;
    Vote[] public votes;

    event VoteCast(
        address indexed voter,
        bytes32 indexed electionId,
        bytes32 indexed candidateId,
        uint256 timestamp
    );

    modifier hasNotVoted(bytes32 electionId) {
        require(!hasVoted[electionId][msg.sender], "Already voted in this election");
        _;
    }

    function castVote(bytes32 electionId, bytes32 candidateId) 
        external 
        hasNotVoted(electionId) 
    {
        hasVoted[electionId][msg.sender] = true;
        votesCount[candidateId]++;
        
        votes.push(Vote({
            voter: msg.sender,
            electionId: electionId,
            candidateId: candidateId,
            timestamp: block.timestamp
        }));

        emit VoteCast(msg.sender, electionId, candidateId, block.timestamp);
    }

    function getVoteCount(bytes32 candidateId) external view returns (uint256) {
        return votesCount[candidateId];
    }

    function hasUserVoted(bytes32 electionId, address voter) external view returns (bool) {
        return hasVoted[electionId][voter];
    }
}