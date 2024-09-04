import { Keyboard, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native'
import React, { useState } from 'react'
import { TransparentButton } from '@components/ButtonComponents'
import { FormInput } from '@components/UIComponents'
import Dropdown from '@components/Dropdown/Dropdown'
import { Spacing } from '@styles/index'

type Props = {
  tags: string[]
  onSelect: (tags: string[]) => void
}

const TagPicker = ({ tags, onSelect }: Props) => {
  const handleAddTag = (text: string) => {
    if (!tags.includes(text)) onSelect([...tags, text])
  }

  const handleRemoveTag = (text: string) => {
    const updatedTags = tags.filter(t => t !== text)
    onSelect(updatedTags)
  }

  return (
    <View style={[Spacing.flexColumnStretch]}>
      <Dropdown initial={''} label='enter symptoms' dataType='allergySymptoms' withSearch={true} searchLabel='symptom' onSelect={handleAddTag} onSelectCustom={(text: string) => handleAddTag(text)} contentPosition='top' shouldReset={true} />

      <View style={styles.tagCon}>
        { tags.length > 0 && tags.map(tag => 
          <TransparentButton key={tag} icon='close' title={tag} size='xSmall' onPress={() => handleRemoveTag(tag)} h={5} v={5} />
        ) }
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  tagCon: {
    ...Spacing.flexRowStretch,
    flexWrap: 'wrap',
    marginTop: 15,
  }
})

export default TagPicker