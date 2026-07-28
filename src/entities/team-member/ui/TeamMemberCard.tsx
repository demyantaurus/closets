import Image from 'next/image'
import React from 'react'

import type { TeamMember } from '@/shared/api'
import { imageProps } from '@/shared/lib'

import styles from './TeamMemberCard.module.scss'

export function TeamMemberCard({ member }: { member: TeamMember }) {
  const image = imageProps(member.photo, 'card')
  return (
    <div className={styles.card}>
      <div className={styles.imageWrap}>
        {image && (
          <Image
            className={styles.image}
            src={image.src}
            alt={image.alt}
            fill
            sizes="(max-width: 768px) 50vw, 20vw"
            placeholder={image.blurDataURL ? 'blur' : undefined}
            blurDataURL={image.blurDataURL}
          />
        )}
      </div>
      <p className={styles.name}>{member.name}</p>
      <p className={styles.role}>{member.role}</p>
    </div>
  )
}
