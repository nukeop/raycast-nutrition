import { useState } from 'react';
import { List, Detail, ActionPanel, Action, Color } from '@raycast/api';
import { useFetch } from "@raycast/utils";

interface FoodDetails {
  name: string;
  calories: number;
  serving_size_g: number;
  fat_total_g: number;
  fat_saturated_g: number;
  protein_g: number;
  sodium_mg: number;
  potassium_mg: number;
  cholesterol_mg: number;
  carbohydrates_total_g: number;
  fiber_g: number;
  sugar_g: number;
}

export default function Main() {
  const [searchText, setSearchText] = useState("");
  const { isLoading, data, revalidate, error } = useFetch<FoodDetails[]>(`https://api.api-ninjas.com/v1/nutrition?query=${searchText}`, {
    keepPreviousData: true,
    headers: {
      'X-Api-Key': 'your api key here'
    }
  });

  return <List
    filtering={false}
    isLoading={isLoading}
    navigationTitle="Search Nutrition"
    searchText={searchText}
    onSearchTextChange={setSearchText}
    searchBarPlaceholder="Search for food..."
    throttle
    isShowingDetail
  >
    {!Boolean(data) && <List.EmptyView />}
    {error && <Detail markdown={`# Error\n\n${error.message} ${error.stack}`} />}

    <List.Section title={
      Boolean(data) ?
        `Total calories: ${Math.round(data?.reduce((acc, item) => acc + item.calories, 0) ?? 0)} kcal`
        : 'No results'
    }>
      {!isLoading && Boolean(data) && (data ?? []).map((item, idx) => (
        <List.Item
          key={idx}
          id={idx.toString()}
          title={`${item.serving_size_g} g ${item.name}`}
          actions={
            <ActionPanel>
              <Action.CopyToClipboard title="Copy Response" content={JSON.stringify(item, null, 2)} />
            </ActionPanel>
          }
          detail={
            <List.Item.Detail
              metadata={
                <List.Item.Detail.Metadata>
                  <List.Item.Detail.Metadata.Label title="Calories" text={
                    { color: Color.Magenta, value: `${item.calories} calories` }
                  } />
                  <List.Item.Detail.Metadata.Label title="Serving Size" text={`${item.serving_size_g} g`} />
                  <List.Item.Detail.Metadata.Separator />
                  <List.Item.Detail.Metadata.Label title="Fat" text={`${item.fat_total_g} g`} />
                  <List.Item.Detail.Metadata.Label title="Protein" text={`${item.protein_g} g`} />
                  <List.Item.Detail.Metadata.Label title="Carbohydrates" text={`${item.carbohydrates_total_g} g`} />
                  <List.Item.Detail.Metadata.Separator />
                  <List.Item.Detail.Metadata.Label title="Saturated fat" text={`${item.fat_saturated_g} g`} />
                  <List.Item.Detail.Metadata.Label title="Sugar" text={`${item.sugar_g} g`} />
                  <List.Item.Detail.Metadata.Label title="Fiber" text={`${item.fiber_g} g`} />
                  <List.Item.Detail.Metadata.Label title="Sodium" text={`${item.sodium_mg} mg`} />
                  <List.Item.Detail.Metadata.Label title="Potassium" text={`${item.potassium_mg} mg`} />
                  <List.Item.Detail.Metadata.Label title="Cholesterol" text={`${item.cholesterol_mg} mg`} />
                </List.Item.Detail.Metadata>
              }
            />
          }
        />
      ))
      }
    </List.Section>
  </List >
}