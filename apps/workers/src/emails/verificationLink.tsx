import * as React from 'react'
import { Tailwind, Section, Text, Button } from '@react-email/components'

const LinkEmail = ({ link }: { link: string }) =>
  <Tailwind>
    <Section className="flex justify-center items-center w-full min-h-screen font-sans">
      <Section className="flex flex-col items-center w-76 rounded-2xl px-6 py-1 bg-mauve-50">
        <Text className="text-xs font-medium text-violet-500">
          Verify your Email Address
        </Text>
        <Text className="text-mauve-500 my-0">
          Use the following code to verify your email address
        </Text>
        <Button className="text-5xl font-bold pt-2" href={link}>Verify</Button>
        <Text className="text-mauve-400 font-light text-xs pb-4">
          This code is valid for 10 minutes
        </Text>
        <Text className="text-mauve-600 text-xs">
          Thank you for joining us
        </Text>
      </Section>
    </Section>
  </Tailwind>

LinkEmail.PreviewProps = {
  link: 'https://client.testapp.lol/verify'
}

export default LinkEmail
