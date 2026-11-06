import SwiftUI

struct SearchFilterExample: View {
    @State private var query = ""
    private let items = ["Apple", "Banana", "Cherry", "Date"]

    private var results: [String] {
        let term = query.trimmingCharacters(in: .whitespacesAndNewlines)
        return term.isEmpty ? items : items.filter { $0.localizedCaseInsensitiveContains(term) }
    }

    var body: some View {
        VStack(alignment: .leading) {
            TextField("Search fruit", text: $query)
            Button("Clear search") { query = "" }.disabled(query.isEmpty)
            Text("\(results.count) results")
            if results.isEmpty {
                Text("No matching fruit. Try another name or clear the search.")
            }
            List(results, id: \.self) { Text($0) }
        }
        .padding()
    }
}
