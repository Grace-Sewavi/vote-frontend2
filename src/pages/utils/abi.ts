const abi = [
  { inputs: [], stateMutability: 'nonpayable', type: 'constructor' },
  { stateMutability: 'payable', type: 'fallback' },
  {
    inputs: [{ internalType: 'address', name: '', type: 'address' }],
    name: '_candidates',
    outputs: [
      { internalType: 'bytes32', name: 'name', type: 'bytes32' },
      { internalType: 'uint256', name: 'votes', type: 'uint256' },
      { internalType: 'address', name: 'candidate_address', type: 'address' }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    name: '_candidates_addresses',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'string', name: '_name', type: 'string' },
      { internalType: 'address', name: '_address', type: 'address' }
    ],
    name: 'addCandidates',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'address', name: '_candidate', type: 'address' }],
    name: 'castVote',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'closeElection',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'electionOngoing',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'getAllCandidates',
    outputs: [
      {
        components: [
          { internalType: 'bytes32', name: 'name', type: 'bytes32' },
          { internalType: 'uint256', name: 'votes', type: 'uint256' },
          {
            internalType: 'address',
            name: 'candidate_address',
            type: 'address'
          }
        ],
        internalType: 'struct Vote.Candidates[]',
        name: '',
        type: 'tuple[]'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'getResults',
    outputs: [
      {
        components: [
          { internalType: 'bytes32', name: 'name', type: 'bytes32' },
          { internalType: 'uint256', name: 'votes', type: 'uint256' },
          {
            internalType: 'address',
            name: 'candidate_address',
            type: 'address'
          }
        ],
        internalType: 'struct Vote.Candidates',
        name: 'winner',
        type: 'tuple'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'address', name: '_voter', type: 'address' }],
    name: 'getVoterInfo',
    outputs: [
      {
        components: [
          { internalType: 'uint8', name: 'age', type: 'uint8' },
          { internalType: 'bool', name: 'hasVoted', type: 'bool' },
          { internalType: 'bytes', name: '_voterId', type: 'bytes' },
          { internalType: 'address', name: 'userAddress', type: 'address' }
        ],
        internalType: 'struct Ivote.UserData',
        name: '',
        type: 'tuple'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'address', name: '_candidate', type: 'address' }],
    name: 'getVotes',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'getaddr',
    outputs: [
      {
        components: [
          { internalType: 'uint8', name: 'age', type: 'uint8' },
          { internalType: 'bool', name: 'hasVoted', type: 'bool' },
          { internalType: 'bytes', name: '_voterId', type: 'bytes' },
          { internalType: 'address', name: 'userAddress', type: 'address' }
        ],
        internalType: 'struct Ivote.UserData',
        name: '_userdata',
        type: 'tuple'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'inec',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'address', name: '', type: 'address' }],
    name: 'isAdmin',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        components: [
          { internalType: 'bytes32', name: 'name', type: 'bytes32' },
          { internalType: 'uint256', name: 'votes', type: 'uint256' },
          {
            internalType: 'address',
            name: 'candidate_address',
            type: 'address'
          }
        ],
        internalType: 'struct Vote.Candidates[]',
        name: 'candidates_',
        type: 'tuple[]'
      }
    ],
    name: 'registerBatchCandidates',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'address', name: '_voter', type: 'address' },
      { internalType: 'bytes', name: '_voterId', type: 'bytes' }
    ],
    name: 'registerVoter',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'reopenElection',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'address', name: '_admin', type: 'address' }],
    name: 'setAdmin',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'address', name: '_newinec', type: 'address' }],
    name: 'setInec',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'address', name: 'addr', type: 'address' },
      { internalType: 'bytes', name: '_voterId', type: 'bytes' }
    ],
    name: 'setaddr',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  { stateMutability: 'payable', type: 'receive' }
]

export default abi;
