import {
  Container,
  Stack,
  Flex,
  Heading,
  Text,
  Button,
  Icon,
  Alert,
  AlertIcon,
  createIcon,
  Image,
  Link,
  useColorModeValue,
  ChakraProvider
} from '@chakra-ui/react';
import { ethers } from "ethers";
import { useState, useEffect } from 'react'
import { useAddress, useDisconnect, useMetamask } from "@thirdweb-dev/react";
import abi from './abi.json';

function App() {
  const connectWithMetamask = useMetamask();
  const disconnect = useDisconnect();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState()
  const address = useAddress();
  console.log(address)

  useEffect(() => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
      provider?.on("network", (newNetwork) => {
        if (newNetwork?.name !== "rinkeby") {
          setStatus("notrinkeby")
        } else {
          setStatus(undefined)

        }
      });
    } catch(e) {
      console.error(e)
    }
  }, []);


  useEffect(() => {
    // checkIfWalletIsConnected();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const askContractToMintNft = async () => {
    setStatus(undefined)
    setLoading(true)
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract("0xA3f21D8166395438f1f4da212deBCE7313bEB46A", abi, signer);

        console.log("Going to pop wallet now to pay gas...")
        let nftTxn = await connectedContract.makeAnEpicNFT();

        console.log("Mining...please wait.")
        await nftTxn.wait();
        console.log(nftTxn);
        console.log(`Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`);
        setLoading(false);
        setStatus("success");

      } else {
        console.log("Ethereum object doesn't exist!");
        setLoading(false)
        setStatus("error");
      }
    } catch (error) {
      console.log(error)
      setLoading(false)
      setStatus("error");
    }
  };



  const renderNotConnectedContainer = () => (
    <Button onClick={connectWithMetamask}
      rounded={'full'}
      size={'lg'}
      fontWeight={'normal'}
      px={6}
      colorScheme={'gray'}
      bg={'#1bfef9'}
      _hover={{ bg: 'gray.500' }}>
      Connect to Wallet
    </Button>

  );

  const renderMintUI = () => (
    <Button isDisabled={status === "notrinkeby"} isLoading={loading} onClick={askContractToMintNft}
      rounded={'full'}
      size={'lg'}
      fontWeight={'normal'}
      px={6}
      colorScheme={'gray'}
      bg={'#1bfef9'}
      _hover={{ bg: 'gray.500' }}>
      Mint NFT  </Button>

  )

  return (
    <ChakraProvider>
      <Container maxW={'7xl'}>
        <Stack
          align={'center'}
          spacing={{ base: 8, md: 10 }}
          py={{ base: 20, md: 28 }}
          direction={{ base: 'column', md: 'row' }}>
          <Stack flex={1} spacing={{ base: 5, md: 10 }}>
            <Heading
              lineHeight={1.1}
              fontWeight={600}
              fontSize={{ base: '3xl', sm: '4xl', lg: '6xl' }}>
              <Text
                as={'span'}
                position={'relative'}
                _after={{
                  content: "''",
                  width: 'full',
                  height: '30%',
                  position: 'absolute',
                  bottom: 1,
                  left: 0,
                  bg: '#1bfef9',
                  zIndex: -1,
                }}>
                Mint a free NFT
              </Text>
              <br />
              <Text as={'span'} color={'gray.400'}>
                on Rinkeby!
              </Text>
            </Heading>
            <Text color={'gray.500'}>
              It's for free and for fun! For minting your very own happy Rinkeby NFT, you need
              to install MetaMask (software wallet), change to Rinkeby testnet and click on "Mint NFT".
            </Text>
            <Stack
              spacing={{ base: 4, sm: 6 }}
              direction={{ base: 'column', sm: 'row' }}>
              {!address ? renderNotConnectedContainer() : renderMintUI()}
 {address ? <Button
 onClick={() => disconnect()}
                rounded={'full'}
                size={'lg'}
                fontWeight={'normal'}
                px={6}
                >
                Disconnect
              </Button> : null}
            </Stack>
          </Stack>
          <Flex
            flex={1}
            justify={'center'}
            align={'center'}
            position={'relative'}
            w={'full'}>
            <Blob
              w={'150%'}
              h={'150%'}
              position={'absolute'}
              top={'-20%'}
              left={0}
              zIndex={-1}
              color={useColorModeValue('gray.50', 'gray.400')}
            />
            <Image src="/rinkebyme.png" />
          </Flex>
        </Stack>
        {status === "success" ? <Alert status='success'>
          <AlertIcon />
          <Text>
            Successfully minted! See your new NFT in our{' '}
            <Link color='teal.500' href='https://testnets.opensea.io/collection/rinkebymenft-v3'>
              collection
            </Link>!
          </Text>

        </Alert> : status === "error" ? <Alert status='error'>
          <AlertIcon />
          There was an error processing your request.
        </Alert> : status === "notrinkeby" ?  <Alert status='warning'>
          <AlertIcon />
          Please change to Rinkeby testnet!
        </Alert> : null}
      </Container>
    </ChakraProvider>
  );
}
export const Blob = (props) => {
  return (
    <Icon
      width={'100%'}
      viewBox="0 0 578 440"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M239.184 439.443c-55.13-5.419-110.241-21.365-151.074-58.767C42.307 338.722-7.478 282.729.938 221.217c8.433-61.644 78.896-91.048 126.871-130.712 34.337-28.388 70.198-51.348 112.004-66.78C282.34 8.024 325.382-3.369 370.518.904c54.019 5.115 112.774 10.886 150.881 49.482 39.916 40.427 49.421 100.753 53.385 157.402 4.13 59.015 11.255 128.44-30.444 170.44-41.383 41.683-111.6 19.106-169.213 30.663-46.68 9.364-88.56 35.21-135.943 30.551z"
        fill="currentColor"
      />
    </Icon>
  );
};

export default App;
